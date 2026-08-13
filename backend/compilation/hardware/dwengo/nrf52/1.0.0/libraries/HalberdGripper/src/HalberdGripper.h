/**
 * HalberdGripper - BLE gripper control for the Halberd board (nRF52840).
 *
 * Implements the Airo Gripper Protocol (AGP) v1, see PROTOCOL.md.
 * The library owns all BLE plumbing (advertising, GATT service, command
 * parsing, ACK/DONE bookkeeping); the sketch only reacts to open/close/move
 * events and reports positions back.
 *
 * Part of the Dwengo compatibility layer for Halberd.
 */
#ifndef HALBERD_GRIPPER_H
#define HALBERD_GRIPPER_H

#include <Arduino.h>
#include <bluefruit.h>

#define HG_PROTOCOL_VERSION 1

#define HG_MAX_AXES  4
#define HG_MAX_POSES 8
#define HG_POSE_NAME_LEN 15
#define HG_MAX_SENSORS 8
#define HG_SENSOR_NAME_LEN 15
#define HG_SENSOR_UNIT_LEN 7

// Command opcodes (central -> peripheral)
#define HG_OP_MOVE_AXES  0x01
#define HG_OP_MOVE_POSE  0x02
#define HG_OP_SET_SPEED  0x03
#define HG_OP_SET_EFFORT 0x04
#define HG_OP_STOP       0x05
#define HG_OP_PING       0x06
#define HG_OP_IDENTIFY   0x07

// Event types (peripheral -> central)
#define HG_EV_ACK      0x01
#define HG_EV_DONE     0x02
#define HG_EV_FAILED   0x03
#define HG_EV_GRASPED  0x10
#define HG_EV_RELEASED 0x11

// Failure reasons
#define HG_ERR_BAD_FRAME    0x01
#define HG_ERR_PREEMPTED    0x02
#define HG_ERR_UNKNOWN      0x03
#define HG_ERR_REJECTED     0x04
#define HG_ERR_OUT_OF_RANGE 0x05

typedef void (*HalberdGripperSimpleCallback)(void);
typedef void (*HalberdGripperMoveCallback)(uint8_t axisId, float target, float speed);
typedef void (*HalberdGripperPoseCallback)(const char* poseName);
typedef void (*HalberdGripperValueCallback)(uint8_t axisId, float value);

class HalberdGripper {
public:
    HalberdGripper();

    // ---- Configuration (call before begin) ----

    /** Declare an actuated axis. For a parallel gripper use one axis in meters. */
    void configureAxis(uint8_t axisId, float minValue, float maxValue, float maxSpeed);

    /** Set the auto-completion tolerance for an axis (default: 2% of range). */
    void setTolerance(uint8_t axisId, float tolerance);

    /** Declare a named pose (one target value per configured axis, in axis order). */
    void definePose(const char* name, const float* axisTargets);

    /**
     * Declare a sensor channel exposed to airo-mono (e.g. force, pressure,
     * proximity). One id per scalar value; values flow via reportSensor().
     */
    void configureSensor(uint8_t sensorId, const char* name, const char* unit, float minValue, float maxValue);

    /** Set the minimum interval between sensor notifications in ms (default 50). */
    void setSensorNotifyInterval(uint16_t intervalMs);

    /** Profile string exposed in the descriptor ("parallel" by default). */
    void setProfile(const char* profile);

    // ---- Event callbacks ----

    void onOpen(HalberdGripperSimpleCallback cb)  { _openCb = cb; }
    void onClose(HalberdGripperSimpleCallback cb) { _closeCb = cb; }
    void onPose(HalberdGripperPoseCallback cb)    { _poseCb = cb; }
    void onMove(HalberdGripperMoveCallback cb)    { _moveCb = cb; }
    void onSetSpeed(HalberdGripperValueCallback cb)  { _speedCb = cb; }
    void onSetEffort(HalberdGripperValueCallback cb) { _effortCb = cb; }
    void onStop(HalberdGripperSimpleCallback cb)  { _stopCb = cb; }
    void onConnect(HalberdGripperSimpleCallback cb)    { _connectCb = cb; }
    void onDisconnect(HalberdGripperSimpleCallback cb) { _disconnectCb = cb; }

    // ---- Lifecycle ----

    /**
     * Start BLE with the given user-assigned name. The name is the primary
     * identity used by airo-mono to select this gripper, so make it unique
     * within your lab (e.g. "gripper-left").
     */
    bool begin(const char* name);

    /** Call from loop(). Handles command completion, LED identify, notifications. */
    void update();

    // ---- Sketch -> library reporting ----

    /** Report the current position of an axis (used for state + auto-DONE). */
    void reportPosition(uint8_t axisId, float position);

    /** Report whether an object is currently grasped. Sends GRASPED/RELEASED events on change. */
    void setGrasped(bool grasped);

    /** Report the current value of a configured sensor (streamed to the central, rate-limited). */
    void reportSensor(uint8_t sensorId, float value);

    /** Report whether the gripper is currently moving (state flag). */
    void setMoving(bool moving);

    /** Explicitly complete the active command (alternative to position-based auto-DONE). */
    void commandDone();

    /** Explicitly fail the active command. */
    void commandFailed(uint8_t reason);

    // ---- Introspection ----

    bool isConnected();
    const char* name() const { return _name; }

private:
    struct Axis {
        bool  configured = false;
        float minValue = 0.0f;
        float maxValue = 0.0f;
        float maxSpeed = 0.0f;
        float tolerance = 0.0f;
        float position = 0.0f;
        float speed = 0.0f;
        // Active motion target
        bool  hasTarget = false;
        float target = 0.0f;
    };

    struct Pose {
        char  name[HG_POSE_NAME_LEN + 1] = {0};
        float targets[HG_MAX_AXES] = {0};
    };

    struct Sensor {
        bool  configured = false;
        char  name[HG_SENSOR_NAME_LEN + 1] = {0};
        char  unit[HG_SENSOR_UNIT_LEN + 1] = {0};
        float minValue = 0.0f;
        float maxValue = 0.0f;
        float value = 0.0f;
    };

    // BLE plumbing
    void startAdvertising();
    void buildDescriptor();
    void handleCommand(const uint8_t* data, uint16_t len);
    void sendEvent(uint8_t type, uint8_t seq);
    void sendEvent(uint8_t type, uint8_t seq, uint8_t payloadByte);
    void notifyState(bool force);
    void notifySensors();
    void finishActiveCommand(uint8_t eventType, uint8_t reason);
    void beginMotionCommand(uint8_t seq);
    bool executePose(const Pose& pose);
    int  findPose(const char* name, uint8_t nameLen) const;

    static void commandWriteCallback(uint16_t connHandle, BLECharacteristic* chr, uint8_t* data, uint16_t len);
    static void connectCallback(uint16_t connHandle);
    static void disconnectCallback(uint16_t connHandle, uint8_t reason);
    static HalberdGripper* _instance;

    BLEService        _service;
    BLECharacteristic _descriptorChr;
    BLECharacteristic _commandChr;
    BLECharacteristic _stateChr;
    BLECharacteristic _eventChr;
    BLECharacteristic _sensorChr;

    char _name[32] = {0};
    char _profile[16] = "parallel";
    char _descriptorJson[512] = {0};

    Axis _axes[HG_MAX_AXES];
    Pose _poses[HG_MAX_POSES];
    uint8_t _poseCount = 0;
    Sensor _sensors[HG_MAX_SENSORS];

    // Active (in-flight) motion command
    bool    _commandActive = false;
    uint8_t _commandSeq = 0;

    // State reporting
    bool     _moving = false;
    bool     _grasped = false;
    bool     _stateDirty = false;
    uint32_t _lastStateNotifyMs = 0;

    // Sensor reporting
    bool     _sensorsDirty = false;
    uint32_t _lastSensorNotifyMs = 0;
    uint16_t _sensorNotifyIntervalMs = 50;

    // Identify blink
    uint32_t _identifyUntilMs = 0;

    // Callbacks
    HalberdGripperSimpleCallback _openCb = nullptr;
    HalberdGripperSimpleCallback _closeCb = nullptr;
    HalberdGripperPoseCallback   _poseCb = nullptr;
    HalberdGripperMoveCallback   _moveCb = nullptr;
    HalberdGripperValueCallback  _speedCb = nullptr;
    HalberdGripperValueCallback  _effortCb = nullptr;
    HalberdGripperSimpleCallback _stopCb = nullptr;
    HalberdGripperSimpleCallback _connectCb = nullptr;
    HalberdGripperSimpleCallback _disconnectCb = nullptr;
};

#endif // HALBERD_GRIPPER_H
