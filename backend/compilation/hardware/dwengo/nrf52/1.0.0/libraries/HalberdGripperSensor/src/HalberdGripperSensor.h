/**
 * HalberdGripperSensor
 *
 * Driver for the HalberdGripper sensor module:
 *  - an analog pressure sensor, read through one of the Halberd analog pins;
 *  - a VL53L4CDV0DH/1 time-of-flight distance sensor, read over I2C
 *    (SDA/SCL of the module connect to a Halberd Wire interface).
 *
 * Usage:
 *   HalberdGripperSensor sensors;          // pressure on A0, ToF on Wire
 *   sensors.begin();
 *   float voltage = sensors.readPressureVoltage();
 *   uint16_t mm;
 *   if (sensors.readDistance(mm)) { ... }
 */
#ifndef HALBERD_GRIPPER_SENSOR_H
#define HALBERD_GRIPPER_SENSOR_H

#include <Arduino.h>
#include <Wire.h>
#include "VL53L4CD_Mini.h"

class HalberdGripperSensor {
  public:
    /**
     * @param pressurePin  analog pin the pressure sensor is connected to.
     * @param wire         I2C bus the ToF sensor is connected to
     *                     (Wire or Wire1 on the Halberd).
     */
    HalberdGripperSensor(uint8_t pressurePin = PIN_A0, TwoWire& wire = Wire);

    /**
     * Initialise both sensors: starts the I2C bus (enabling the on-board
      * pull-ups for the selected bus), initialises the VL53L4CD and starts
      * continuous ranging using the configured timing (default 200 ms budget,
      * tuned for close-range stability).
     *
     * Returns false when the ToF sensor is not detected; the pressure
     * sensor can still be read in that case.
     */
    bool begin();

    /** True when the VL53L4CD was found during begin(). */
    bool distanceSensorConnected() const { return _tofConnected; }

    // --- Pressure sensor ---------------------------------------------------

    /** Raw 12-bit ADC reading (0..4095). */
    uint16_t readPressureRaw();

    /** Pressure sensor output voltage in volts (0 .. 3.6 V ADC range). */
    float readPressureVoltage();

    // --- Time-of-flight sensor ----------------------------------------------

    /** True when a new distance measurement is available. */
    bool distanceReady();

    /**
     * Fetch the latest distance measurement (non-blocking).
     * Returns true and stores the distance in distanceMm when a new, valid
     * measurement was available. Returns false when no new measurement is
     * ready yet or the measurement was invalid (check lastRangeStatus()).
     */
    bool readDistance(uint16_t& distanceMm);

    /** Most recently read distance in millimeters. */
    uint16_t lastDistanceMm() const { return _lastDistanceMm; }

    /** Status of the last measurement, 0 = valid (see ST UM2931). */
    uint8_t lastRangeStatus() const { return _lastRangeStatus; }

    /**
     * Configure ToF timing (10..200 ms). Keep interMeasurementMs = 0 for
     * continuous mode, or set interMeasurementMs > timingBudgetMs for
     * autonomous low-power mode.
     *
     * Can be called before begin() (stored and applied at init) or after
     * begin() (applied immediately when the ToF sensor is connected).
     */
    bool setRangeTimingMs(uint32_t timingBudgetMs, uint32_t interMeasurementMs = 0);

    /** Last requested ToF timing budget (ms). */
    uint32_t timingBudgetMs() const { return _timingBudgetMs; }

    /** Last requested ToF inter-measurement period (ms). */
    uint32_t interMeasurementMs() const { return _interMeasurementMs; }

    /**
     * Apply a signed offset (mm) to distance readings.
     * Example: set -3 to subtract 3 mm from each valid reading.
     */
    void setDistanceOffsetMm(int16_t offsetMm) { _distanceOffsetMm = offsetMm; }

    /** Current signed distance offset in mm. */
    int16_t distanceOffsetMm() const { return _distanceOffsetMm; }

    /** Direct access to the underlying ToF driver for advanced use. */
    VL53L4CD_Mini& tof() { return _tof; }

    /** Enable/disable verbose debug output on a given Stream (default Serial). */
    void setDebugOutput(bool enabled, Stream& stream = Serial) {
      _debugEnabled = enabled;
      _debugStream = &stream;
      _tof.setDebugOutput(enabled, stream);
    }

    /** Returns true when verbose debug output is enabled. */
    bool debugOutputEnabled() const { return _debugEnabled; }

  private:
    uint8_t _pressurePin;
    TwoWire& _wire;
    VL53L4CD_Mini _tof;
    bool _tofConnected = false;
    uint16_t _lastDistanceMm = 0;
    uint8_t _lastRangeStatus = 255;
    uint32_t _timingBudgetMs = 200;
    uint32_t _interMeasurementMs = 0;
    int16_t _distanceOffsetMm = 0;
    bool _debugEnabled = false;
    Stream* _debugStream = &Serial;
};

#endif // HALBERD_GRIPPER_SENSOR_H
