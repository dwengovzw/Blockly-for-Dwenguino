/**
 * Minimal VL53L4CD time-of-flight sensor driver (I2C).
 *
 * A compact reimplementation of the parts of the ST VL53L4CD Ultra Lite
 * Driver needed to boot the sensor and read distances. Register addresses,
 * the default configuration table and the init/timing sequences are derived
 * from STMicroelectronics' VL53L4CD ULD (BSD-3-Clause,
 * (c) 2021 STMicroelectronics).
 */
#ifndef VL53L4CD_MINI_H
#define VL53L4CD_MINI_H

#include <Arduino.h>
#include <Wire.h>

#define VL53L4CD_DEFAULT_I2C_ADDRESS 0x29
#define VL53L4CD_RANGE_VALID         0

class VL53L4CD_Mini {
  public:
    VL53L4CD_Mini(TwoWire& wire = Wire, uint8_t address = VL53L4CD_DEFAULT_I2C_ADDRESS);

    /**
     * Initialise the sensor. The I2C bus must already be started with
     * wire.begin(). Returns false when the sensor does not answer, reports
     * an unexpected model id, or times out while booting.
     */
    bool begin();

    /**
     * Configure the ranging timing.
     * @param timingBudgetMs      measurement duration, 10..200 ms.
     * @param interMeasurementMs  pause between measurements. 0 = continuous
     *                            mode, otherwise must be > timingBudgetMs
     *                            (autonomous low-power mode).
     */
    bool setRangeTiming(uint32_t timingBudgetMs, uint32_t interMeasurementMs);

    /** Start continuous/autonomous ranging. */
    bool startRanging();

    /** Stop ranging. */
    void stopRanging();

    /** True when a new measurement is available. */
    bool dataReady();

    /**
     * Read the latest measurement and clear the sensor interrupt so the
     * next measurement can complete. Only call when dataReady() is true.
     * @param distanceMm   measured distance in millimeters.
     * @param rangeStatus  0 (VL53L4CD_RANGE_VALID) when the measurement is
     *                     valid, other values indicate wraparound/sigma/
     *                     signal failures (see ST UM2931).
     */
    bool read(uint16_t& distanceMm, uint8_t& rangeStatus);

    /** Human-readable stage of the last failure, or "ok". */
    const char* lastErrorStage() const;

    /** Most recent low-level Wire error from endTransmission(). */
    uint8_t lastWireError() const { return _lastWireError; }

    /** Most recently read model ID (useful when init fails early). */
    uint16_t lastModelId() const { return _lastModelId; }

    /** Enable/disable verbose debug output on a given Stream (default Serial). */
    void setDebugOutput(bool enabled, Stream& stream = Serial) {
      _debugEnabled = enabled;
      _debugStream = &stream;
    }

    /** Returns true when verbose debug output is enabled. */
    bool debugOutputEnabled() const { return _debugEnabled; }

  private:
    enum ErrorStage {
        ERROR_STAGE_OK,
        ERROR_STAGE_READ_MODEL_ID,
        ERROR_STAGE_WAIT_FOR_BOOT,
        ERROR_STAGE_LOAD_DEFAULT_CONFIG,
        ERROR_STAGE_START_VHV,
        ERROR_STAGE_WAIT_VHV_READY,
        ERROR_STAGE_SET_POST_VHV_CONFIG,
        ERROR_STAGE_SET_RANGE_TIMING,
        ERROR_STAGE_START_RANGING,
        ERROR_STAGE_WAIT_FIRST_SAMPLE,
        ERROR_STAGE_READ_MEASUREMENT
    };

    void setErrorStage(ErrorStage stage);
    bool waitForBoot();
    bool waitForDataReady();
    void clearInterrupt();

    bool writeMulti(uint16_t reg, const uint8_t* data, uint8_t length);
    bool readMulti(uint16_t reg, uint8_t* data, uint8_t length);
    void writeByte(uint16_t reg, uint8_t value);
    void writeWord(uint16_t reg, uint16_t value);
    void writeDWord(uint16_t reg, uint32_t value);
    uint8_t readByte(uint16_t reg);
    uint16_t readWord(uint16_t reg);
    uint32_t readDWord(uint16_t reg);

    TwoWire& _wire;
    uint8_t _address;
    ErrorStage _lastErrorStage = ERROR_STAGE_OK;
    uint8_t _lastWireError = 0;
    uint16_t _lastModelId = 0;
    bool _debugEnabled = false;
    Stream* _debugStream = &Serial;
};

#endif // VL53L4CD_MINI_H
