/**
 * Halberd parallel gripper with two BLE poses: open and pressure-controlled closed.
 * Wiring matches parallel_gripper_servo_with_sensors: servos on D1/D2 (SERVO_1/SERVO_2),
 * pressure on A0 and the VL53L4CD on Wire (SDA/SCL). USB serial is diagnostic only.
 *
 * Tune the pressure setpoint and gains for your gripper. This sensor's ADC
 * reading falls as grip pressure rises, and increasing servo angle closes the jaws.
 */
#include <Arduino.h>
#include <HalberdGripper.h>
#include <HalberdGripperSensor.h>
#include <Servo.h>

// BLE name airo-mono uses to find this gripper.
#define GRIPPER_NAME "gripper-left-pid"

// Jaw widths are in meters. Linkage geometry maps servo travel to a width estimate.
constexpr float widthMin = 0.000f;
constexpr float widthMax = 0.079f;
constexpr float maxWidthSpeed = 0.15f;  // m/s, informational
constexpr float linkageLength = 0.03f;
constexpr float linkageAngleClosed = 65.4f;
constexpr float linkageAngleOpen = 154.2f;
constexpr float servoCorrection = 1.5f;  // Servo degrees per degree of linkage rotation.
constexpr float servoOpen = 0.0f;
constexpr float servoClosed = (linkageAngleOpen - linkageAngleClosed) * servoCorrection;
constexpr float degreesToRadians = PI / 180.0f;

// Sensor channel IDs in the BLE descriptor. ToF is distance in millimeters.
constexpr uint8_t sensorIdTof = 0;
constexpr uint8_t sensorIdPressure = 1;

// PID uses raw 12-bit ADC counts; BLE pressure telemetry uses volts.
constexpr float adcVoltsPerCount = 3.6f / 4095.0f;
constexpr int targetPressure = 1250;  // ADC reading to maintain when gripping.
constexpr int pressureDeadband = 10;  // Allow this many counts on either side of the target.

// PID output is servo degrees per second. With ki and kd at zero, only P is active.
constexpr float kp = 0.04f;
constexpr float ki = 0.0f;
constexpr float kd = 0.0f;
constexpr float maxServoSpeed = 40.0f;  // Speed limit for opening and pressure control (deg/s).
constexpr float integralLimit = 1000.0f;  // Caps accumulated error (ADC counts * seconds).
constexpr uint32_t controlIntervalMs = 10;  // Minimum time between control updates.
constexpr uint32_t pressureSettleMs = 100;  // Time continuously in the deadband before close succeeds.
constexpr uint32_t closeTimeoutMs = 10000;  // Time allowed to reach stable pressure after close starts.

// ACQUIRE_PRESSURE awaits BLE command completion; HOLD_PRESSURE keeps regulating
// after completion. HOLD leaves the servos at their last commanded angle.
enum Mode { NO_REQUEST, HOLD, OPENING, ACQUIRE_PRESSURE, HOLD_PRESSURE };

HalberdGripper gripper;  // Receives BLE commands and publishes state and sensor readings.
HalberdGripperSensor sensors(PIN_A0, Wire);  // Reads pressure from A0 and ToF distance over I2C.
// Both finger servos receive the same angle command.
Servo finger1Servo;
Servo finger2Servo;

bool ready = false;  // Enable the control loop only after the sensors, servos, and BLE are ready.
Mode pendingMode = NO_REQUEST;  // Latest BLE request waiting for loop() to pick it up.
Mode mode = HOLD;  // Mode currently being executed by the control loop.

float servoAngle = servoOpen;  // Commanded angle, not a measured angle. Keep fractional steps.

// PID history is cleared on mode changes and inside the pressure deadband.
float integral = 0.0f;  // Pressure error accumulated over time.
float previousError = 0.0f;  // Last error sample, used to calculate the derivative.
bool havePreviousError = false;  // Skip the derivative until there are two samples.

bool inPressureBand = false;  // True while consecutive samples are within the deadband.
uint32_t pressureBandSinceMs = 0;  // Start of the current in-band period.
uint32_t closeStartedMs = 0;  // Start of pressure acquisition, used to detect timeout.
uint32_t lastControlMs = 0;  // Reference time for the next update's elapsed time (dt).

/**
 * @brief Estimate jaw opening for BLE telemetry using forward kinematics.
 * @param angle Commanded servo angle in degrees.
 * @return Estimated jaw opening in meters, clamped to the configured width range.
 */
float servoAngleToWidth(float angle) {
  // Forward kinematics: project one linkage horizontally and double its travel
  // for the two jaws. This estimate is for BLE state, not pressure feedback.
  const float linkageAngle = linkageAngleOpen - angle / servoCorrection;
  const float width = 2.0f * linkageLength * (cosf(linkageAngleClosed * degreesToRadians)
    - cosf(linkageAngle * degreesToRadians));
  return constrain(width, widthMin, widthMax);
}

/** @brief Clear the integral and derivative history without changing the servo command. */
void resetController() {
  integral = 0.0f;
  previousError = 0.0f;
  havePreviousError = false;
}

/** @brief Stop motion and pressure regulation while holding the last commanded angle. */
void holdPosition() {
  mode = HOLD;
  inPressureBand = false;
  resetController();
  gripper.setMoving(false);
}

/**
 * @brief Queue a mode change from a BLE callback without touching the controller state.
 * @param nextMode Mode to apply on the next loop iteration, replacing any pending request.
 */
void requestMode(Mode nextMode) {
  // Bluefruit callbacks run in a different task. Pass only the latest request
  // to loop(), which owns the PID state and servo writes.
  taskENTER_CRITICAL();
  pendingMode = nextMode;
  taskEXIT_CRITICAL();
}

/**
 * @brief Consume the pending mode request and restart control timing for the new mode.
 * @param now Current time in milliseconds from millis().
 */
void applyModeRequest(uint32_t now) {
  taskENTER_CRITICAL();
  const Mode requestedMode = pendingMode;
  pendingMode = NO_REQUEST;
  taskEXIT_CRITICAL();
  if (requestedMode == NO_REQUEST) {
    return;
  }

  // Start each command with fresh PID history and timing.
  holdPosition();
  lastControlMs = now;
  if (requestedMode == ACQUIRE_PRESSURE) {
    closeStartedMs = now;
  }
  mode = requestedMode;
}

/** @brief Round the commanded angle to whole degrees and send it to both servos. */
void writeServos() {
  int angle = (int)(servoAngle + 0.5f);
  finger1Servo.write(angle);
  finger2Servo.write(angle);
}

/**
 * @brief Compute a speed-limited PID correction and update controller history.
 * @param error Measured pressure ADC counts minus the target ADC counts.
 * @param dt Elapsed time in seconds since the last control update; must be positive.
 * @return Servo speed in degrees per second; positive closes the jaws.
 */
float pressureSpeed(float error, float dt) {
  const float derivative = havePreviousError ? (error - previousError) / dt : 0.0f;
  const float candidateIntegral = constrain(integral + error * dt, -integralLimit, integralLimit);
  const float candidateOutput = kp * error + ki * candidateIntegral + kd * derivative;
  // Prevent integral windup when the error would push farther past a travel or speed limit.
  const bool pushingFurther =
    (error > 0.0f && (servoAngle >= servoClosed || candidateOutput > maxServoSpeed)) ||
    (error < 0.0f && (servoAngle <= servoOpen || candidateOutput < -maxServoSpeed));
  if (!pushingFurther) {
    integral = candidateIntegral;
  }
  previousError = error;
  havePreviousError = true;
  return constrain(kp * error + ki * integral + kd * derivative, -maxServoSpeed, maxServoSpeed);
}

/**
 * @brief Advance opening or pressure regulation and report motion state to BLE.
 *
 * Completes an open command at the open angle. Completes a close command once
 * pressure settles, then keeps regulating. Reports failure if acquisition times out.
 *
 * @param now Current time in milliseconds from millis().
 * @param dt Elapsed time in seconds since the last control update.
 * @param pressure Latest raw pressure reading in ADC counts.
 */
void updateControl(uint32_t now, float dt, int pressure) {
  const float previousAngle = servoAngle;
  bool done = false;
  if (mode == OPENING) {
    servoAngle = max(servoOpen, servoAngle - maxServoSpeed * dt);
    done = servoAngle == servoOpen;
    if (done) {
      holdPosition();
    }
  } else if (mode == ACQUIRE_PRESSURE || mode == HOLD_PRESSURE) {
    // A reading above the target means too little grip pressure: increase the angle.
    const int error = pressure - targetPressure;
    if (abs(error) <= pressureDeadband) {
      // Avoid small corrections in the deadband. Close only completes after
      // the reading stays in the band continuously for pressureSettleMs.
      resetController();
      if (!inPressureBand) {
        inPressureBand = true;
        pressureBandSinceMs = now;
      }
      if (mode == ACQUIRE_PRESSURE && now - pressureBandSinceMs >= pressureSettleMs) {
        mode = HOLD_PRESSURE;
        done = true;
      }
    } else {
      inPressureBand = false;
    }

    if (mode == ACQUIRE_PRESSURE && now - closeStartedMs >= closeTimeoutMs) {
      // Give up on an unsettled close without driving the jaws any farther.
      holdPosition();
      gripper.commandFailed(HG_ERR_REJECTED);
      Serial.println("Close failed: pressure target did not settle.");
    } else if (!inPressureBand) {
      const float speed = pressureSpeed(error, dt);
      // Integrate the speed over this tick and clamp it to the servo travel.
      servoAngle = constrain(servoAngle + speed * dt, servoOpen, servoClosed);
    }
  }

  if (servoAngle != previousAngle) {
    writeServos();
    gripper.reportPosition(0, servoAngleToWidth(servoAngle));
  }
  gripper.setMoving(mode != HOLD && servoAngle != previousAngle);
  if (done) {
    gripper.commandDone();
  }
}

/** @brief Initialize the sensors, set the servos to open, and advertise the BLE gripper. */
void setup() {
  Serial.begin(115200);
  sensors.setDebugOutput(false);
  sensors.setRangeTimingMs(10, 0);
  sensors.setDistanceOffsetMm(-3);
  if (!sensors.begin()) {
    Serial.println("VL53L4CD initialization failed; servos disabled.");
    return;
  }

  const float openPose[] = { widthMax };
  const float closedPose[] = { widthMin };
  gripper.configureAxis(0, widthMin, widthMax, maxWidthSpeed);
  // Close can succeed around an object at nonzero width, so the control loop
  // explicitly signals when each pose command is complete.
  gripper.setAutoCompleteMotion(false);
  gripper.definePose("open", openPose);
  gripper.definePose("closed", closedPose);
  gripper.configureSensor(sensorIdTof, "tof", "mm", 0.0f, 1200.0f);
  gripper.configureSensor(sensorIdPressure, "pressure", "V", 0.0f, 3.6f);
  gripper.reportPosition(0, servoAngleToWidth(servoAngle));

  gripper.onOpen([]() { requestMode(OPENING); });
  gripper.onClose([]() { requestMode(ACQUIRE_PRESSURE); });
  // Stop regulating on STOP or disconnect; do not release the servo position.
  gripper.onStop([]() { requestMode(HOLD); });
  gripper.onDisconnect([]() { requestMode(HOLD); });

  finger1Servo.attach(D1, 900, 2100);
  finger2Servo.attach(D2, 900, 2100);
  if (!finger1Servo.attached() || !finger2Servo.attached()) {
    finger1Servo.detach();
    finger2Servo.detach();
    Serial.println("Servo attachment failed; servos disabled.");
    return;
  }
  writeServos();
  if (!gripper.begin(GRIPPER_NAME)) {
    finger1Servo.detach();
    finger2Servo.detach();
    Serial.println("HalberdGripper BLE initialization failed; servos disabled.");
    return;
  }
  lastControlMs = millis();
  ready = true;
  Serial.println("HalberdGripper advertising as " GRIPPER_NAME);
}

/** @brief Apply BLE requests, run timed control updates, and publish sensor readings. */
void loop() {
  if (!ready) {
    delay(250);
    return;
  }

  const uint32_t now = millis();
  applyModeRequest(now);
  // Use actual elapsed time for PID and keep sampling sensors even while idle.
  const uint32_t elapsedMs = now - lastControlMs;
  if (elapsedMs >= controlIntervalMs) {
    lastControlMs = now;
    const uint16_t pressureRaw = sensors.readPressureRaw();
    updateControl(now, elapsedMs / 1000.0f, pressureRaw);
    gripper.reportSensor(sensorIdPressure, pressureRaw * adcVoltsPerCount);

    uint16_t distanceMm;
    // Publish only fresh, valid ToF samples.
    if (sensors.readDistance(distanceMm)) {
      gripper.reportSensor(sensorIdTof, distanceMm);
    }
  }
  gripper.update();
  delay(1);
}
