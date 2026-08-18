/**
 * Minimal VL53L4CD driver implementation. See VL53L4CD_Mini.h.
 *
 * Register map, default configuration table and init sequence derived from
 * the STMicroelectronics VL53L4CD Ultra Lite Driver:
 *   (c) 2021 STMicroelectronics, BSD-3-Clause.
 */
#include "VL53L4CD_Mini.h"

// Register addresses (from ST ULD vl53l4cd_api.h)
#define REG_VHV_CONFIG_TIMEOUT_MACROP_LOOP_BOUND 0x0008
#define REG_OSC_FREQUENCY                        0x0006
#define REG_GPIO_HV_MUX_CTRL                     0x0030
#define REG_GPIO_TIO_HV_STATUS                   0x0031
#define REG_RANGE_CONFIG_A                       0x005E
#define REG_RANGE_CONFIG_B                       0x0061
#define REG_INTERMEASUREMENT_MS                  0x006C
#define REG_SYSTEM_INTERRUPT_CLEAR               0x0086
#define REG_SYSTEM_START                         0x0087
#define REG_RESULT_RANGE_STATUS                  0x0089
#define REG_RESULT_SPAD_NB                       0x008C
#define REG_RESULT_DISTANCE                      0x0096
#define REG_RESULT_OSC_CALIBRATE_VAL             0x00DE
#define REG_FIRMWARE_SYSTEM_STATUS               0x00E5
#define REG_IDENTIFICATION_MODEL_ID              0x010F

#define VL53L4CD_MODEL_ID 0xEBAA
#define VL53L4CD_I2C_RETRY_COUNT 10

#define VL53_DEBUG_PRINT(value) do { if (_debugEnabled && _debugStream != nullptr) { _debugStream->print(value); } } while (0)
#define VL53_DEBUG_PRINTLN(value) do { if (_debugEnabled && _debugStream != nullptr) { _debugStream->println(value); } } while (0)

// Default configuration, written to registers 0x2D..0x87 during init.
// This follows the ST VL53L4CD ULD 2.2.3 defaults without
// VL53L4CD_I2C_FAST_MODE_PLUS enabled.
static const uint8_t VL53L4CD_DEFAULT_CONFIGURATION[] = {
    0x00, 0x00, 0x00, 0x11, 0x02, 0x00, 0x02, 0x08, /* 0x2d - 0x34 */
    0x00, 0x08, 0x10, 0x01, 0x01, 0x00, 0x00, 0x00, /* 0x35 - 0x3c */
    0x00, 0xff, 0x00, 0x0F, 0x00, 0x00, 0x00, 0x00, /* 0x3d - 0x44 */
    0x00, 0x20, 0x0b, 0x00, 0x00, 0x02, 0x14, 0x21, /* 0x45 - 0x4c */
    0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0xc8, /* 0x4d - 0x54 */
    0x00, 0x00, 0x38, 0xff, 0x01, 0x00, 0x08, 0x00, /* 0x55 - 0x5c */
    0x00, 0x01, 0xcc, 0x07, 0x01, 0xf1, 0x05, 0x00, /* 0x5d - 0x64 */
    0xa0, 0x00, 0x80, 0x08, 0x38, 0x00, 0x00, 0x00, /* 0x65 - 0x6c */
    0x00, 0x0f, 0x89, 0x00, 0x00, 0x00, 0x00, 0x00, /* 0x6d - 0x74 */
    0x00, 0x00, 0x01, 0x07, 0x05, 0x06, 0x06, 0x00, /* 0x75 - 0x7c */
    0x00, 0x02, 0xc7, 0xff, 0x9B, 0x00, 0x00, 0x00, /* 0x7d - 0x84 */
    0x01, 0x00, 0x00                                /* 0x85 - 0x87 */
};

VL53L4CD_Mini::VL53L4CD_Mini(TwoWire& wire, uint8_t address)
    : _wire(wire), _address(address) {
}

bool VL53L4CD_Mini::begin() {
    setErrorStage(ERROR_STAGE_OK);
    _lastWireError = 0;

    VL53_DEBUG_PRINTLN("[VL53] begin()");
    _lastModelId = readWord(REG_IDENTIFICATION_MODEL_ID);
    if (_debugEnabled && _debugStream != nullptr) {
        _debugStream->print("[VL53] model id: 0x");
        _debugStream->println(_lastModelId, HEX);
    }
    if (_lastModelId != VL53L4CD_MODEL_ID) {
        setErrorStage(ERROR_STAGE_READ_MODEL_ID);
        VL53_DEBUG_PRINTLN("[VL53] fail: read_model_id");
        return false;
    }

    VL53_DEBUG_PRINTLN("[VL53] waitForBoot()");
    if (!waitForBoot()) {
        setErrorStage(ERROR_STAGE_WAIT_FOR_BOOT);
        VL53_DEBUG_PRINTLN("[VL53] fail: wait_for_boot");
        return false;
    }

    VL53_DEBUG_PRINTLN("[VL53] loading default configuration");

    // Load default configuration.
    for (uint8_t reg = 0x2D; reg <= 0x87; reg++) {
        writeByte(reg, VL53L4CD_DEFAULT_CONFIGURATION[reg - 0x2D]);
        if (_lastWireError != 0) {
            setErrorStage(ERROR_STAGE_LOAD_DEFAULT_CONFIG);
            if (_debugEnabled && _debugStream != nullptr) {
                _debugStream->print("[VL53] fail: load_default_config at reg 0x");
                _debugStream->println(reg, HEX);
            }
            return false;
        }
    }

    // Start VHV calibration and wait for the first (calibration) sample.
    VL53_DEBUG_PRINTLN("[VL53] start VHV");
    writeByte(REG_SYSTEM_START, 0x40);
    if (_lastWireError != 0) {
        setErrorStage(ERROR_STAGE_START_VHV);
        VL53_DEBUG_PRINTLN("[VL53] fail: start_vhv");
        return false;
    }
    VL53_DEBUG_PRINTLN("[VL53] wait for VHV data ready");
    if (!waitForDataReady()) {
        setErrorStage(ERROR_STAGE_WAIT_VHV_READY);
        VL53_DEBUG_PRINTLN("[VL53] fail: wait_vhv_ready");
        return false;
    }
    clearInterrupt();
    stopRanging();

    VL53_DEBUG_PRINTLN("[VL53] post VHV config");
    writeByte(REG_VHV_CONFIG_TIMEOUT_MACROP_LOOP_BOUND, 0x09);
    writeByte(0x0B, 0x00);
    writeWord(0x0024, 0x500);
    if (_lastWireError != 0) {
        setErrorStage(ERROR_STAGE_SET_POST_VHV_CONFIG);
        VL53_DEBUG_PRINTLN("[VL53] fail: set_post_vhv_config");
        return false;
    }

    // Default: 200 ms timing budget, continuous mode (better close-range stability).
    VL53_DEBUG_PRINTLN("[VL53] setRangeTiming(200, 0)");
    if (!setRangeTiming(200, 0)) {
        setErrorStage(ERROR_STAGE_SET_RANGE_TIMING);
        VL53_DEBUG_PRINTLN("[VL53] fail: set_range_timing");
        return false;
    }

    setErrorStage(ERROR_STAGE_OK);
    VL53_DEBUG_PRINTLN("[VL53] begin ok");
    return true;
}

bool VL53L4CD_Mini::setRangeTiming(uint32_t timingBudgetMs, uint32_t interMeasurementMs) {
    if (timingBudgetMs < 10 || timingBudgetMs > 200) return false;

    uint16_t oscFrequency = readWord(REG_OSC_FREQUENCY);
    if (oscFrequency == 0) return false;

    uint32_t timingBudgetUs = timingBudgetMs * 1000UL;
    uint32_t macroPeriodUs = (uint32_t)((uint32_t)2304 * ((uint32_t)0x40000000 / (uint32_t)oscFrequency)) >> 6;

    if (interMeasurementMs == 0) {
        // Continuous mode.
        writeDWord(REG_INTERMEASUREMENT_MS, 0);
        timingBudgetUs -= 2500UL;
    } else if (interMeasurementMs > timingBudgetMs) {
        // Autonomous low-power mode.
        uint16_t clockPll = readWord(REG_RESULT_OSC_CALIBRATE_VAL) & 0x3FF;
        float factor = 1.055f * (float)interMeasurementMs * (float)clockPll;
        writeDWord(REG_INTERMEASUREMENT_MS, (uint32_t)factor);
        timingBudgetUs -= 4300UL;
        timingBudgetUs /= 2UL;
    } else {
        return false;
    }

    // Encode timing budget into RANGE_CONFIG_A and RANGE_CONFIG_B.
    timingBudgetUs = timingBudgetUs << 12;

    uint32_t tmp = macroPeriodUs * 16UL;
    uint32_t lsByte = ((timingBudgetUs + ((tmp >> 6) >> 1)) / (tmp >> 6)) - 1UL;
    uint16_t msByte = 0;
    while ((lsByte & 0xFFFFFF00UL) > 0UL) {
        lsByte = lsByte >> 1;
        msByte++;
    }
    writeWord(REG_RANGE_CONFIG_A, (uint16_t)(msByte << 8) + (uint16_t)(lsByte & 0xFFUL));

    tmp = macroPeriodUs * 12UL;
    lsByte = ((timingBudgetUs + ((tmp >> 6) >> 1)) / (tmp >> 6)) - 1UL;
    msByte = 0;
    while ((lsByte & 0xFFFFFF00UL) > 0UL) {
        lsByte = lsByte >> 1;
        msByte++;
    }
    writeWord(REG_RANGE_CONFIG_B, (uint16_t)(msByte << 8) + (uint16_t)(lsByte & 0xFFUL));

    return true;
}

bool VL53L4CD_Mini::startRanging() {
    uint32_t interMeasurement = readDWord(REG_INTERMEASUREMENT_MS);
    if (_debugEnabled && _debugStream != nullptr) {
        _debugStream->print("[VL53] startRanging(), interMeasurement=");
        _debugStream->println(interMeasurement);
    }
    // 0x21 = continuous mode, 0x40 = autonomous mode.
    writeByte(REG_SYSTEM_START, interMeasurement == 0 ? 0x21 : 0x40);
    if (_lastWireError != 0) {
        setErrorStage(ERROR_STAGE_START_RANGING);
        VL53_DEBUG_PRINTLN("[VL53] fail: start_ranging");
        return false;
    }
    setErrorStage(ERROR_STAGE_OK);
    VL53_DEBUG_PRINTLN("[VL53] startRanging ok");
    return true;
}

void VL53L4CD_Mini::stopRanging() {
    writeByte(REG_SYSTEM_START, 0x80);
}

bool VL53L4CD_Mini::dataReady() {
    uint8_t intPol = ((readByte(REG_GPIO_HV_MUX_CTRL) & 0x10) >> 4) ? 0 : 1;
    return (readByte(REG_GPIO_TIO_HV_STATUS) & 0x01) == intPol;
}

bool VL53L4CD_Mini::read(uint16_t& distanceMm, uint8_t& rangeStatus) {
    // Translation from device status to ST ULD user status codes.
    static const uint8_t statusRtn[24] = {
        255, 255, 255, 5, 2, 4, 1, 7, 3, 0, 255, 255,
        9, 13, 255, 255, 255, 255, 10, 6, 255, 255, 11, 12
    };

    uint8_t status = readByte(REG_RESULT_RANGE_STATUS) & 0x1F;
    rangeStatus = (status < 24) ? statusRtn[status] : status;

    uint16_t spadCount = readWord(REG_RESULT_SPAD_NB) / 256;
    if (spadCount == 0) rangeStatus = 255;

    distanceMm = readWord(REG_RESULT_DISTANCE);
    if (_lastWireError != 0) {
        setErrorStage(ERROR_STAGE_READ_MEASUREMENT);
        return false;
    }

    clearInterrupt();
    return rangeStatus == VL53L4CD_RANGE_VALID;
}

const char* VL53L4CD_Mini::lastErrorStage() const {
    switch (_lastErrorStage) {
        case ERROR_STAGE_OK: return "ok";
        case ERROR_STAGE_READ_MODEL_ID: return "read_model_id";
        case ERROR_STAGE_WAIT_FOR_BOOT: return "wait_for_boot";
        case ERROR_STAGE_LOAD_DEFAULT_CONFIG: return "load_default_config";
        case ERROR_STAGE_START_VHV: return "start_vhv";
        case ERROR_STAGE_WAIT_VHV_READY: return "wait_vhv_ready";
        case ERROR_STAGE_SET_POST_VHV_CONFIG: return "set_post_vhv_config";
        case ERROR_STAGE_SET_RANGE_TIMING: return "set_range_timing";
        case ERROR_STAGE_START_RANGING: return "start_ranging";
        case ERROR_STAGE_WAIT_FIRST_SAMPLE: return "wait_first_sample";
        case ERROR_STAGE_READ_MEASUREMENT: return "read_measurement";
        default: return "unknown";
    }
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

bool VL53L4CD_Mini::waitForBoot() {
    for (uint16_t i = 0; i < 1000; i++) {
        uint8_t bootStatus = readByte(REG_FIRMWARE_SYSTEM_STATUS);
        if (bootStatus == 0x03) return true;
        if (_lastWireError != 0) return false;
        if ((i % 100) == 0) {
            if (_debugEnabled && _debugStream != nullptr) {
                _debugStream->print("[VL53] boot poll: 0x");
                _debugStream->println(bootStatus, HEX);
            }
        }
        delay(1);
    }
    return false;
}

bool VL53L4CD_Mini::waitForDataReady() {
    for (uint16_t i = 0; i < 1000; i++) {
        if (dataReady()) return true;
        if (_lastWireError != 0) return false;
        if ((i % 100) == 0) {
            VL53_DEBUG_PRINTLN("[VL53] waiting for data ready...");
        }
        delay(1);
    }
    return false;
}

void VL53L4CD_Mini::clearInterrupt() {
    writeByte(REG_SYSTEM_INTERRUPT_CLEAR, 0x01);
}

void VL53L4CD_Mini::setErrorStage(ErrorStage stage) {
    _lastErrorStage = stage;
}

bool VL53L4CD_Mini::writeMulti(uint16_t reg, const uint8_t* data, uint8_t length) {
    if (_debugEnabled && _debugStream != nullptr) {
        _debugStream->print("[VL53] write reg 0x");
        _debugStream->print(reg, HEX);
        _debugStream->print(", len=");
        _debugStream->println(length);
    }

    for (uint8_t attempt = 0; attempt < VL53L4CD_I2C_RETRY_COUNT; attempt++) {
        _lastWireError = 0;
        _wire.beginTransmission(_address);
        _wire.write((uint8_t)(reg >> 8));
        _wire.write((uint8_t)(reg & 0xFF));
        if (_wire.write(data, length) != length) {
            _lastWireError = 5;
            VL53_DEBUG_PRINTLN("[VL53] write buffer phase failed");
            _wire.endTransmission(true);
            return false;
        }
        _lastWireError = _wire.endTransmission(true);
        if (_lastWireError == 0) {
            return true;
        }
        if (_debugEnabled && _debugStream != nullptr) {
            _debugStream->print("[VL53] write retry ");
            _debugStream->print(attempt + 1);
            _debugStream->print(" failed, wire_error=");
            _debugStream->println(_lastWireError);
        }
        delay(1);
    }

    return false;
}

bool VL53L4CD_Mini::readMulti(uint16_t reg, uint8_t* data, uint8_t length) {
    if (_debugEnabled && _debugStream != nullptr) {
        _debugStream->print("[VL53] read reg 0x");
        _debugStream->print(reg, HEX);
        _debugStream->print(", len=");
        _debugStream->println(length);
    }

    for (uint8_t attempt = 0; attempt < VL53L4CD_I2C_RETRY_COUNT; attempt++) {
        _lastWireError = 0;
        _wire.beginTransmission(_address);
        _wire.write((uint8_t)(reg >> 8));
        _wire.write((uint8_t)(reg & 0xFF));
        _lastWireError = _wire.endTransmission(false);
        if (_lastWireError == 0) {
            break;
        }

        if (_debugEnabled && _debugStream != nullptr) {
            _debugStream->print("[VL53] read address retry ");
            _debugStream->print(attempt + 1);
            _debugStream->print(" failed, wire_error=");
            _debugStream->println(_lastWireError);
        }
        delay(1);
    }

    if (_lastWireError != 0) {
        if (_debugEnabled && _debugStream != nullptr) {
            _debugStream->print("[VL53] read address phase failed, wire_error=");
            _debugStream->println(_lastWireError);
        }
        return false;
    }

    size_t bytesRead = _wire.requestFrom(_address, (size_t)length);
    if (bytesRead != length) {
        _lastWireError = 6;
        if (_debugEnabled && _debugStream != nullptr) {
            _debugStream->print("[VL53] read payload failed, bytesRead=");
            _debugStream->print(bytesRead);
            _debugStream->print(", expected=");
            _debugStream->println(length);
        }
        while (_wire.available()) {
            (void)_wire.read();
        }
        return false;
    }

    for (uint8_t i = 0; i < length; i++) {
        data[i] = (uint8_t)_wire.read();
    }
    return true;
}

// I2C helpers: 16-bit register address, big-endian data.

void VL53L4CD_Mini::writeByte(uint16_t reg, uint8_t value) {
    writeMulti(reg, &value, 1);
}

void VL53L4CD_Mini::writeWord(uint16_t reg, uint16_t value) {
    uint8_t data[2] = {
        (uint8_t)(value >> 8),
        (uint8_t)(value & 0xFF)
    };
    writeMulti(reg, data, 2);
}

void VL53L4CD_Mini::writeDWord(uint16_t reg, uint32_t value) {
    uint8_t data[4] = {
        (uint8_t)(value >> 24),
        (uint8_t)(value >> 16),
        (uint8_t)(value >> 8),
        (uint8_t)(value & 0xFF)
    };
    writeMulti(reg, data, 4);
}

uint8_t VL53L4CD_Mini::readByte(uint16_t reg) {
    uint8_t value = 0;
    if (!readMulti(reg, &value, 1)) return 0;
    return value;
}

uint16_t VL53L4CD_Mini::readWord(uint16_t reg) {
    uint8_t data[2] = { 0, 0 };
    if (!readMulti(reg, data, 2)) return 0;
    return ((uint16_t)data[0] << 8) | data[1];
}

uint32_t VL53L4CD_Mini::readDWord(uint16_t reg) {
    uint8_t data[4] = { 0, 0, 0, 0 };
    if (!readMulti(reg, data, 4)) return 0;
    return ((uint32_t)data[0] << 24)
        | ((uint32_t)data[1] << 16)
        | ((uint32_t)data[2] << 8)
        | (uint32_t)data[3];
}
