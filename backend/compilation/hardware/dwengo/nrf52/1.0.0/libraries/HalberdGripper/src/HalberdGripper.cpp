/**
 * HalberdGripper implementation. See PROTOCOL.md for the wire format.
 */
#include "HalberdGripper.h"

// AGP 128-bit UUIDs, little-endian byte order as required by Bluefruit.
// Base: 9B8Exxxx-5C3A-4F1B-B4A2-6C9D0A7E5D10
#define HG_UUID_BYTES(idLow) \
    { 0x10, 0x5D, 0x7E, 0x0A, 0x9D, 0x6C, 0xA2, 0xB4, \
      0x1B, 0x4F, 0x3A, 0x5C, (idLow), 0x00, 0x8E, 0x9B }

static const uint8_t HG_UUID_SERVICE[16]    = HG_UUID_BYTES(0x01);
static const uint8_t HG_UUID_DESCRIPTOR[16] = HG_UUID_BYTES(0x02);
static const uint8_t HG_UUID_COMMAND[16]    = HG_UUID_BYTES(0x03);
static const uint8_t HG_UUID_STATE[16]      = HG_UUID_BYTES(0x04);
static const uint8_t HG_UUID_EVENT[16]      = HG_UUID_BYTES(0x05);
static const uint8_t HG_UUID_SENSOR[16]     = HG_UUID_BYTES(0x06);

#define HG_STATE_NOTIFY_INTERVAL_MS 50   // ~20 Hz
#define HG_IDENTIFY_DURATION_MS     2000

HalberdGripper* HalberdGripper::_instance = nullptr;

static float readF32LE(const uint8_t* p) {
    float value;
    memcpy(&value, p, sizeof(float));
    return value;
}

HalberdGripper::HalberdGripper()
    : _service(HG_UUID_SERVICE),
      _descriptorChr(HG_UUID_DESCRIPTOR),
      _commandChr(HG_UUID_COMMAND),
      _stateChr(HG_UUID_STATE),
      _eventChr(HG_UUID_EVENT),
      _sensorChr(HG_UUID_SENSOR) {
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

void HalberdGripper::configureAxis(uint8_t axisId, float minValue, float maxValue, float maxSpeed) {
    if (axisId >= HG_MAX_AXES) return;
    Axis& axis = _axes[axisId];
    axis.configured = true;
    axis.minValue = minValue;
    axis.maxValue = maxValue;
    axis.maxSpeed = maxSpeed;
    axis.tolerance = 0.02f * fabsf(maxValue - minValue);
    axis.position = minValue;
}

void HalberdGripper::setTolerance(uint8_t axisId, float tolerance) {
    if (axisId >= HG_MAX_AXES) return;
    _axes[axisId].tolerance = tolerance;
}

void HalberdGripper::definePose(const char* name, const float* axisTargets) {
    if (_poseCount >= HG_MAX_POSES) return;
    Pose& pose = _poses[_poseCount];
    strncpy(pose.name, name, HG_POSE_NAME_LEN);
    pose.name[HG_POSE_NAME_LEN] = '\0';
    for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
        pose.targets[i] = _axes[i].configured ? axisTargets[i] : 0.0f;
    }
    _poseCount++;
}

void HalberdGripper::setProfile(const char* profile) {
    strncpy(_profile, profile, sizeof(_profile) - 1);
    _profile[sizeof(_profile) - 1] = '\0';
}

void HalberdGripper::configureSensor(uint8_t sensorId, const char* name, const char* unit, float minValue, float maxValue) {
    if (sensorId >= HG_MAX_SENSORS) return;
    Sensor& sensor = _sensors[sensorId];
    sensor.configured = true;
    strncpy(sensor.name, name, HG_SENSOR_NAME_LEN);
    sensor.name[HG_SENSOR_NAME_LEN] = '\0';
    strncpy(sensor.unit, unit, HG_SENSOR_UNIT_LEN);
    sensor.unit[HG_SENSOR_UNIT_LEN] = '\0';
    sensor.minValue = minValue;
    sensor.maxValue = maxValue;
    sensor.value = minValue;
}

void HalberdGripper::setSensorNotifyInterval(uint16_t intervalMs) {
    _sensorNotifyIntervalMs = intervalMs;
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

bool HalberdGripper::begin(const char* name) {
    _instance = this;
    strncpy(_name, name, sizeof(_name) - 1);
    _name[sizeof(_name) - 1] = '\0';

    pinMode(LED_BUILTIN, OUTPUT);

    if (!Bluefruit.begin()) {
        return false;
    }
    Bluefruit.setTxPower(4);
    Bluefruit.setName(_name);
    Bluefruit.Periph.setConnectCallback(HalberdGripper::connectCallback);
    Bluefruit.Periph.setDisconnectCallback(HalberdGripper::disconnectCallback);

    _service.begin();

    buildDescriptor();
    _descriptorChr.setProperties(CHR_PROPS_READ);
    _descriptorChr.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    _descriptorChr.setMaxLen(sizeof(_descriptorJson));
    _descriptorChr.begin();
    _descriptorChr.write(_descriptorJson, strlen(_descriptorJson));

    _commandChr.setProperties(CHR_PROPS_WRITE | CHR_PROPS_WRITE_WO_RESP);
    _commandChr.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
    _commandChr.setMaxLen(64);
    _commandChr.setWriteCallback(HalberdGripper::commandWriteCallback);
    _commandChr.begin();

    _stateChr.setProperties(CHR_PROPS_NOTIFY);
    _stateChr.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    _stateChr.setMaxLen(2 + HG_MAX_AXES * sizeof(float));
    _stateChr.begin();

    _eventChr.setProperties(CHR_PROPS_NOTIFY);
    _eventChr.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    _eventChr.setMaxLen(8);
    _eventChr.begin();

    _sensorChr.setProperties(CHR_PROPS_NOTIFY);
    _sensorChr.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    _sensorChr.setMaxLen(1 + HG_MAX_SENSORS * sizeof(float));
    _sensorChr.begin();

    startAdvertising();
    return true;
}

void HalberdGripper::startAdvertising() {
    Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
    Bluefruit.Advertising.addTxPower();
    Bluefruit.Advertising.addService(_service);
    // The user-assigned name is the primary identity: advertise it in the
    // scan response (no room next to the 128-bit service UUID).
    Bluefruit.ScanResponse.addName();

    Bluefruit.Advertising.restartOnDisconnect(true);
    Bluefruit.Advertising.setInterval(32, 244);
    Bluefruit.Advertising.setFastTimeout(30);
    Bluefruit.Advertising.start(0);
}

void HalberdGripper::buildDescriptor() {
    // Axes array
    char axesJson[192] = {0};
    size_t offset = 0;
    for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
        if (!_axes[i].configured) continue;
        offset += snprintf(axesJson + offset, sizeof(axesJson) - offset,
            "%s{\"id\":%u,\"min\":%.4f,\"max\":%.4f,\"maxSpeed\":%.4f}",
            (offset > 0) ? "," : "", i, _axes[i].minValue, _axes[i].maxValue, _axes[i].maxSpeed);
    }

    // Poses array
    char posesJson[128] = {0};
    offset = 0;
    for (uint8_t i = 0; i < _poseCount; i++) {
        offset += snprintf(posesJson + offset, sizeof(posesJson) - offset,
            "%s\"%s\"", (offset > 0) ? "," : "", _poses[i].name);
    }

    // Sensors array
    char sensorsJson[192] = {0};
    offset = 0;
    for (uint8_t i = 0; i < HG_MAX_SENSORS; i++) {
        if (!_sensors[i].configured) continue;
        offset += snprintf(sensorsJson + offset, sizeof(sensorsJson) - offset,
            "%s{\"id\":%u,\"name\":\"%s\",\"unit\":\"%s\",\"min\":%.4f,\"max\":%.4f}",
            (offset > 0) ? "," : "", i, _sensors[i].name, _sensors[i].unit,
            _sensors[i].minValue, _sensors[i].maxValue);
    }

    snprintf(_descriptorJson, sizeof(_descriptorJson),
        "{\"protocol\":%d,\"name\":\"%s\",\"deviceId\":\"%s\",\"profile\":\"%s\","
        "\"axes\":[%s],\"poses\":[%s],\"sensors\":[%s]}",
        HG_PROTOCOL_VERSION, _name, getMcuUniqueID(), _profile, axesJson, posesJson, sensorsJson);
}

void HalberdGripper::update() {
    uint32_t now = millis();

    // Identify blink
    if (_identifyUntilMs != 0) {
        if (now < _identifyUntilMs) {
            digitalWrite(LED_BUILTIN, ((now / 125) % 2) ? HIGH : LOW);
        } else {
            digitalWrite(LED_BUILTIN, LOW);
            _identifyUntilMs = 0;
        }
    }

    // Auto-complete the active motion command when all targets are reached.
    if (_commandActive) {
        bool allReached = true;
        bool anyTarget = false;
        for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
            Axis& axis = _axes[i];
            if (!axis.configured || !axis.hasTarget) continue;
            anyTarget = true;
            if (fabsf(axis.position - axis.target) > axis.tolerance) {
                allReached = false;
                break;
            }
        }
        if (anyTarget && allReached) {
            finishActiveCommand(HG_EV_DONE, 0);
        }
    }

    // Rate-limited state notification
    if (_stateDirty && (now - _lastStateNotifyMs) >= HG_STATE_NOTIFY_INTERVAL_MS) {
        notifyState(false);
    }

    // Rate-limited sensor notification
    if (_sensorsDirty && (now - _lastSensorNotifyMs) >= _sensorNotifyIntervalMs) {
        notifySensors();
    }
}

// ---------------------------------------------------------------------------
// Sketch -> library reporting
// ---------------------------------------------------------------------------

void HalberdGripper::reportPosition(uint8_t axisId, float position) {
    if (axisId >= HG_MAX_AXES || !_axes[axisId].configured) return;
    if (_axes[axisId].position != position) {
        _axes[axisId].position = position;
        _stateDirty = true;
    }
}

void HalberdGripper::setGrasped(bool grasped) {
    if (grasped == _grasped) return;
    _grasped = grasped;
    _stateDirty = true;
    sendEvent(grasped ? HG_EV_GRASPED : HG_EV_RELEASED, 0);
}

void HalberdGripper::reportSensor(uint8_t sensorId, float value) {
    if (sensorId >= HG_MAX_SENSORS || !_sensors[sensorId].configured) return;
    if (_sensors[sensorId].value != value) {
        _sensors[sensorId].value = value;
        _sensorsDirty = true;
    }
}

void HalberdGripper::setMoving(bool moving) {
    if (moving == _moving) return;
    _moving = moving;
    _stateDirty = true;
}

void HalberdGripper::commandDone() {
    if (_commandActive) finishActiveCommand(HG_EV_DONE, 0);
}

void HalberdGripper::commandFailed(uint8_t reason) {
    if (_commandActive) finishActiveCommand(HG_EV_FAILED, reason);
}

bool HalberdGripper::isConnected() {
    return Bluefruit.connected();
}

// ---------------------------------------------------------------------------
// Command handling
// ---------------------------------------------------------------------------

void HalberdGripper::beginMotionCommand(uint8_t seq) {
    // Preempt any in-flight motion command.
    if (_commandActive) {
        finishActiveCommand(HG_EV_FAILED, HG_ERR_PREEMPTED);
    }
    _commandActive = true;
    _commandSeq = seq;
    for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
        _axes[i].hasTarget = false;
    }
}

void HalberdGripper::finishActiveCommand(uint8_t eventType, uint8_t reason) {
    _commandActive = false;
    for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
        _axes[i].hasTarget = false;
    }
    if (eventType == HG_EV_FAILED) {
        sendEvent(HG_EV_FAILED, _commandSeq, reason);
    } else {
        sendEvent(eventType, _commandSeq);
    }
}

int HalberdGripper::findPose(const char* name, uint8_t nameLen) const {
    for (uint8_t i = 0; i < _poseCount; i++) {
        if (strlen(_poses[i].name) == nameLen && strncmp(_poses[i].name, name, nameLen) == 0) {
            return i;
        }
    }
    return -1;
}

bool HalberdGripper::executePose(const Pose& pose) {
    for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
        if (!_axes[i].configured) continue;
        _axes[i].target = pose.targets[i];
        _axes[i].hasTarget = true;
    }
    if (strcmp(pose.name, "open") == 0 && _openCb != nullptr) {
        _openCb();
    } else if (strcmp(pose.name, "closed") == 0 && _closeCb != nullptr) {
        _closeCb();
    } else if (_poseCb != nullptr) {
        _poseCb(pose.name);
    } else if (_moveCb != nullptr) {
        for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
            if (_axes[i].configured) _moveCb(i, _axes[i].target, _axes[i].speed);
        }
    } else {
        return false;
    }
    return true;
}

void HalberdGripper::handleCommand(const uint8_t* data, uint16_t len) {
    if (len < 2) return;
    uint8_t seq = data[0];
    uint8_t opcode = data[1];
    const uint8_t* payload = data + 2;
    uint16_t payloadLen = len - 2;

    switch (opcode) {
        case HG_OP_MOVE_AXES: {
            if (payloadLen < 1) { sendEvent(HG_EV_FAILED, seq, HG_ERR_BAD_FRAME); return; }
            uint8_t count = payload[0];
            if (payloadLen < (uint16_t)(1 + count * 5)) { sendEvent(HG_EV_FAILED, seq, HG_ERR_BAD_FRAME); return; }
            // Validate all axes first.
            for (uint8_t i = 0; i < count; i++) {
                uint8_t axisId = payload[1 + i * 5];
                float target = readF32LE(payload + 2 + i * 5);
                if (axisId >= HG_MAX_AXES || !_axes[axisId].configured) {
                    sendEvent(HG_EV_FAILED, seq, HG_ERR_UNKNOWN);
                    return;
                }
                if (target < _axes[axisId].minValue || target > _axes[axisId].maxValue) {
                    sendEvent(HG_EV_FAILED, seq, HG_ERR_OUT_OF_RANGE);
                    return;
                }
            }
            sendEvent(HG_EV_ACK, seq);
            beginMotionCommand(seq);
            for (uint8_t i = 0; i < count; i++) {
                uint8_t axisId = payload[1 + i * 5];
                float target = readF32LE(payload + 2 + i * 5);
                _axes[axisId].target = target;
                _axes[axisId].hasTarget = true;
                if (_moveCb != nullptr) {
                    _moveCb(axisId, target, _axes[axisId].speed);
                }
            }
            if (_moveCb == nullptr) {
                finishActiveCommand(HG_EV_FAILED, HG_ERR_REJECTED);
            }
            break;
        }

        case HG_OP_MOVE_POSE: {
            if (payloadLen < 1 || payloadLen < (uint16_t)(1 + payload[0])) {
                sendEvent(HG_EV_FAILED, seq, HG_ERR_BAD_FRAME);
                return;
            }
            int poseIndex = findPose((const char*)(payload + 1), payload[0]);
            if (poseIndex < 0) {
                sendEvent(HG_EV_FAILED, seq, HG_ERR_UNKNOWN);
                return;
            }
            sendEvent(HG_EV_ACK, seq);
            beginMotionCommand(seq);
            if (!executePose(_poses[poseIndex])) {
                finishActiveCommand(HG_EV_FAILED, HG_ERR_REJECTED);
            }
            break;
        }

        case HG_OP_SET_SPEED:
        case HG_OP_SET_EFFORT: {
            if (payloadLen < 5) { sendEvent(HG_EV_FAILED, seq, HG_ERR_BAD_FRAME); return; }
            uint8_t axisId = payload[0];
            float value = readF32LE(payload + 1);
            if (axisId >= HG_MAX_AXES || !_axes[axisId].configured) {
                sendEvent(HG_EV_FAILED, seq, HG_ERR_UNKNOWN);
                return;
            }
            sendEvent(HG_EV_ACK, seq);
            if (opcode == HG_OP_SET_SPEED) {
                _axes[axisId].speed = value;
                if (_speedCb != nullptr) _speedCb(axisId, value);
            } else {
                if (_effortCb != nullptr) _effortCb(axisId, value);
            }
            sendEvent(HG_EV_DONE, seq);
            break;
        }

        case HG_OP_STOP: {
            sendEvent(HG_EV_ACK, seq);
            if (_commandActive) {
                finishActiveCommand(HG_EV_FAILED, HG_ERR_PREEMPTED);
            }
            if (_stopCb != nullptr) _stopCb();
            sendEvent(HG_EV_DONE, seq);
            break;
        }

        case HG_OP_PING: {
            sendEvent(HG_EV_ACK, seq);
            sendEvent(HG_EV_DONE, seq);
            break;
        }

        case HG_OP_IDENTIFY: {
            sendEvent(HG_EV_ACK, seq);
            _identifyUntilMs = millis() + HG_IDENTIFY_DURATION_MS;
            sendEvent(HG_EV_DONE, seq);
            break;
        }

        default:
            sendEvent(HG_EV_FAILED, seq, HG_ERR_BAD_FRAME);
            break;
    }
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

void HalberdGripper::sendEvent(uint8_t type, uint8_t seq) {
    uint8_t frame[2] = { type, seq };
    _eventChr.notify(frame, sizeof(frame));
}

void HalberdGripper::sendEvent(uint8_t type, uint8_t seq, uint8_t payloadByte) {
    uint8_t frame[3] = { type, seq, payloadByte };
    _eventChr.notify(frame, sizeof(frame));
}

void HalberdGripper::notifyState(bool force) {
    (void)force;
    uint8_t frame[2 + HG_MAX_AXES * sizeof(float)];
    uint8_t flags = 0;
    if (_moving) flags |= 0x01;
    if (_grasped) flags |= 0x02;

    uint8_t axisCount = 0;
    for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
        if (!_axes[i].configured) continue;
        memcpy(frame + 2 + axisCount * sizeof(float), &_axes[i].position, sizeof(float));
        axisCount++;
    }
    frame[0] = flags;
    frame[1] = axisCount;

    _stateChr.notify(frame, 2 + axisCount * sizeof(float));
    _stateDirty = false;
    _lastStateNotifyMs = millis();
}

void HalberdGripper::notifySensors() {
    uint8_t frame[1 + HG_MAX_SENSORS * sizeof(float)];
    uint8_t sensorCount = 0;
    for (uint8_t i = 0; i < HG_MAX_SENSORS; i++) {
        if (!_sensors[i].configured) continue;
        memcpy(frame + 1 + sensorCount * sizeof(float), &_sensors[i].value, sizeof(float));
        sensorCount++;
    }
    frame[0] = sensorCount;

    _sensorChr.notify(frame, 1 + sensorCount * sizeof(float));
    _sensorsDirty = false;
    _lastSensorNotifyMs = millis();
}

// ---------------------------------------------------------------------------
// Static BLE callbacks
// ---------------------------------------------------------------------------

void HalberdGripper::commandWriteCallback(uint16_t connHandle, BLECharacteristic* chr, uint8_t* data, uint16_t len) {
    (void)connHandle;
    (void)chr;
    if (_instance != nullptr) {
        _instance->handleCommand(data, len);
    }
}

void HalberdGripper::connectCallback(uint16_t connHandle) {
    (void)connHandle;
    if (_instance != nullptr) {
        _instance->_stateDirty = true; // push a fresh snapshot to the new central
        if (_instance->_connectCb != nullptr) _instance->_connectCb();
    }
}

void HalberdGripper::disconnectCallback(uint16_t connHandle, uint8_t reason) {
    (void)connHandle;
    (void)reason;
    if (_instance != nullptr) {
        // Failsafe: drop any in-flight command; the sketch decides what the
        // actuators should do via the onDisconnect callback.
        _instance->_commandActive = false;
        for (uint8_t i = 0; i < HG_MAX_AXES; i++) {
            _instance->_axes[i].hasTarget = false;
        }
        if (_instance->_disconnectCb != nullptr) _instance->_disconnectCb();
    }
}
