/**
 * HalberdGripperSensor implementation.
 */
#include "HalberdGripperSensor.h"

// The Adafruit nRF52 core defaults to the internal 0.6 V reference with a
// 1/6 gain, giving a 0..3.6 V input range.
#define HGS_ADC_REFERENCE_V 3.6f
#define HGS_ADC_RESOLUTION  12
#define HGS_ADC_MAX         4095.0f

#define HGS_DEBUG_PRINT(obj, value) do { if ((obj)._debugEnabled && (obj)._debugStream != nullptr) { (obj)._debugStream->print(value); } } while (0)
#define HGS_DEBUG_PRINTLN(obj, value) do { if ((obj)._debugEnabled && (obj)._debugStream != nullptr) { (obj)._debugStream->println(value); } } while (0)

static bool rawProbeVL53L4CD(TwoWire& wire, uint16_t& modelId, uint8_t& wireError) {
    modelId = 0;
    wire.beginTransmission(0x29);
    wire.write((uint8_t)0x01);
    wire.write((uint8_t)0x0F);
    wireError = wire.endTransmission(false);
    if (wireError != 0) {
        return false;
    }

    if (wire.requestFrom((uint8_t)0x29, (size_t)2) != 2) {
        wireError = 6;
        while (wire.available()) {
            (void)wire.read();
        }
        return false;
    }

    modelId = ((uint16_t)wire.read() << 8) | (uint16_t)wire.read();
    wireError = 0;
    return modelId == 0xEBAA;
}

HalberdGripperSensor::HalberdGripperSensor(uint8_t pressurePin, TwoWire& wire)
    : _pressurePin(pressurePin), _wire(wire), _tof(wire) {
}

bool HalberdGripperSensor::begin() {
    HGS_DEBUG_PRINTLN((*this), "[HGS] begin()");
    HGS_DEBUG_PRINT((*this), "[HGS] pressure pin: ");
    HGS_DEBUG_PRINTLN((*this), _pressurePin);

    // Use only internal pull-ups on the selected I2C pins.
    if (&_wire == &Wire) {
        pinMode(PIN_WIRE_SDA, INPUT_PULLUP);
        pinMode(PIN_WIRE_SCL, INPUT_PULLUP);
    }
#if (WIRE_INTERFACES_COUNT > 1)
    if (&_wire == &Wire1) {
        pinMode(PIN_WIRE1_SDA, INPUT_PULLUP);
        pinMode(PIN_WIRE1_SCL, INPUT_PULLUP);
    }
#endif

    pinMode(_pressurePin, INPUT);
    analogReadResolution(HGS_ADC_RESOLUTION);

    HGS_DEBUG_PRINTLN((*this), "[HGS] calling Wire.begin()");
    _wire.begin();
    _wire.setClock(100000);
    delay(20);

    uint16_t rawProbeModelId = 0;
    uint8_t rawProbeError = 0;
    bool rawProbeOk = rawProbeVL53L4CD(_wire, rawProbeModelId, rawProbeError);
    HGS_DEBUG_PRINT((*this), "[HGS] raw probe ok -> ");
    HGS_DEBUG_PRINTLN((*this), rawProbeOk ? "true" : "false");
    if (_debugEnabled && _debugStream != nullptr) {
        _debugStream->print("[HGS] raw probe model id: 0x");
        _debugStream->println(rawProbeModelId, HEX);
        _debugStream->print("[HGS] raw probe wire error: ");
        _debugStream->println(rawProbeError);
    }

    HGS_DEBUG_PRINTLN((*this), "[HGS] calling tof.begin()");
    bool tofInit = _tof.begin();
    HGS_DEBUG_PRINT((*this), "[HGS] tof.begin() -> ");
    HGS_DEBUG_PRINTLN((*this), tofInit ? "true" : "false");

    bool tofStart = false;
    if (tofInit) {
        HGS_DEBUG_PRINT((*this), "[HGS] setRangeTimingMs(");
        HGS_DEBUG_PRINT((*this), _timingBudgetMs);
        HGS_DEBUG_PRINT((*this), ", ");
        HGS_DEBUG_PRINT((*this), _interMeasurementMs);
        HGS_DEBUG_PRINTLN((*this), ")");
        bool timingOk = _tof.setRangeTiming(_timingBudgetMs, _interMeasurementMs);
        if (!timingOk) {
            HGS_DEBUG_PRINTLN((*this), "[HGS] setRangeTimingMs failed");
            tofInit = false;
        }
    }

    if (tofInit) {
        HGS_DEBUG_PRINTLN((*this), "[HGS] calling tof.startRanging()");
        tofStart = _tof.startRanging();
        HGS_DEBUG_PRINT((*this), "[HGS] tof.startRanging() -> ");
        HGS_DEBUG_PRINTLN((*this), tofStart ? "true" : "false");
    }

    HGS_DEBUG_PRINT((*this), "[HGS] last error stage: ");
    HGS_DEBUG_PRINTLN((*this), _tof.lastErrorStage());
    HGS_DEBUG_PRINT((*this), "[HGS] last wire error: ");
    HGS_DEBUG_PRINTLN((*this), _tof.lastWireError());
    if (_debugEnabled && _debugStream != nullptr) {
        _debugStream->print("[HGS] last model id: 0x");
        _debugStream->println(_tof.lastModelId(), HEX);
    }

    _tofConnected = tofInit && tofStart;
    HGS_DEBUG_PRINT((*this), "[HGS] begin result -> ");
    HGS_DEBUG_PRINTLN((*this), _tofConnected ? "connected" : "not connected");
    return _tofConnected;
}

bool HalberdGripperSensor::setRangeTimingMs(uint32_t timingBudgetMs, uint32_t interMeasurementMs) {
    if (timingBudgetMs < 10 || timingBudgetMs > 200) {
        return false;
    }
    if (interMeasurementMs != 0 && interMeasurementMs <= timingBudgetMs) {
        return false;
    }

    _timingBudgetMs = timingBudgetMs;
    _interMeasurementMs = interMeasurementMs;

    if (_tofConnected) {
        return _tof.setRangeTiming(_timingBudgetMs, _interMeasurementMs);
    }
    return true;
}

// ---------------------------------------------------------------------------
// Pressure sensor
// ---------------------------------------------------------------------------

uint16_t HalberdGripperSensor::readPressureRaw() {
    return analogRead(_pressurePin);
}

float HalberdGripperSensor::readPressureVoltage() {
    return (float)readPressureRaw() * (HGS_ADC_REFERENCE_V / HGS_ADC_MAX);
}

// ---------------------------------------------------------------------------
// Time-of-flight sensor
// ---------------------------------------------------------------------------

bool HalberdGripperSensor::distanceReady() {
    return _tofConnected && _tof.dataReady();
}

bool HalberdGripperSensor::readDistance(uint16_t& distanceMm) {
    if (!distanceReady()) return false;

    uint16_t rawDistanceMm;
    bool valid = _tof.read(rawDistanceMm, _lastRangeStatus);
    if (valid) {
        int32_t corrected = (int32_t)rawDistanceMm + (int32_t)_distanceOffsetMm;
        if (corrected < 0) corrected = 0;
        _lastDistanceMm = (uint16_t)corrected;
        distanceMm = _lastDistanceMm;
    }
    return valid;
}
