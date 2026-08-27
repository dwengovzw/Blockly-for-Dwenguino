/**
 * Parallel gripper example for the HalberdGripper library.
 *
 * A servo on SERVO_1 drives a two-finger parallel gripper. The gripper is
 * controllable from airo-mono over BLE using the user-assigned name below.
 *
 * Wire protocol and discovery: see the library's PROTOCOL.md.
 */
#include <HalberdGripper.h>
#include <Servo.h>

// The name airo-mono uses to select THIS gripper. Make it unique in your lab.
#define GRIPPER_NAME "gripper-left"

// Gripper geometry 
#define WIDTH_MIN 0.000f    // 0mm
#define WIDTH_MAX 0.079f  // 79mm
#define MAX_SPEED 0.15f   // m/s, informational
#define LINKAGE_LENGTH 0.03f // 30mm, length of the linkages in the gripper.

// Servo angles corresponding to fully closed / fully open
#define ANGLE_CLOSED 88.8
#define ANGLE_OPEN   0

// Angles of the top linkage in the gripper in world coordinates and in degrees.
#define LINKAGE_ANGLE_CLOSED  65.4f
#define LINKAGE_ANGLE_OPEN   154.2f

HalberdGripper gripper;
Servo finger1Servo;
Servo finger2Servo;

float targetWidth = WIDTH_MAX;
float currentWidth = WIDTH_MAX;

// Dummy sensor values for demonstration. Replace with real sensor readings in a real gripper.
float dummyForceSensorValue = 0.0f;

// Forward kinematics for converting the servo angle to an opening for one finger.
// d = (WIDTH_MAX/2) - LINKAGE_LENGTH * cos(LINKAGE_ANGLE_OPEN - servoAngle)
// Inverse kinematics for converting a desired opening to a servo angle for one finger.
// servoAngle = LINKAGE_ANGLE_OPEN - acos(((WIDTH_MAX/2) - d) / LINKAGE_LENGTH)

// Convert a width between the fingers to an angle for both servos. Assume the fingers are symmetric.
/*int widthToAngle(float width) {
  float singleFingerWidth = width / 2.0f;
  float angleOffset = acosf(((WIDTH_MAX / 2.0f) - singleFingerWidth) / LINKAGE_LENGTH);
  angleOffset = angleOffset * 180.0f / M_PI; // convert to degrees
  float angle = LINKAGE_ANGLE_OPEN - angleOffset;
  Serial.print("Width: ");Serial.print(width, 3);
  Serial.print(" m, Servo angle: ");Serial.print(angle, 1);
  Serial.println(" deg");
  return (int)angle;
}*/

int widthToAngle(float width) {
  float singleFingerWidth = width / 2.0f;
  float servoAngle = LINKAGE_ANGLE_OPEN - acosf(cos(LINKAGE_ANGLE_CLOSED * M_PI / 180.0f) - singleFingerWidth / LINKAGE_LENGTH) * 180.0f / M_PI;
  // If servo is reversed, reverse servo angle here.
  //servoAngle = 180 - servoAngle;
  Serial.print("Width: ");Serial.print(width, 3);
  Serial.print(" m, Servo angle: ");Serial.print(servoAngle, 1);
  Serial.println(" deg");
  // Compute forward kinematics to verify the result (optional).
  float computedWidth = LINKAGE_LENGTH * cos(LINKAGE_ANGLE_CLOSED * M_PI / 180.0f) - LINKAGE_LENGTH * cos((LINKAGE_ANGLE_OPEN - servoAngle) * M_PI / 180.0f);
  Serial.print("Computed width from servo angle: ");Serial.print(computedWidth, 3);
  Serial.println(" m");
  return (int)servoAngle;
}



void setup() {
  Serial.begin(115200);

  // min/max pulse widths (µs) for your specific servo — adjust to match
  // the datasheet. 1000–2000 µs is a common default; some servos use 500–2500 µs.
  finger1Servo.attach(SERVO_1, 900, 2100);
  finger2Servo.attach(SERVO_2, 900, 2100);

  // One axis: the finger opening in meters (profile "parallel" is the default).
  gripper.configureAxis(0, WIDTH_MIN, WIDTH_MAX, MAX_SPEED);

  float openPose[]   = { WIDTH_MAX };
  float closedPose[] = { WIDTH_MIN };
  gripper.definePose("open", openPose);
  gripper.definePose("closed", closedPose);

  // Sensors declared here show up in the descriptor and stream to airo-mono.
  gripper.configureSensor(0, "tof", "mm", 0.0f, 1200.0f);
  gripper.configureSensor(1, "force", "Ohm", 0.0f, 1024.0f);

  gripper.onOpen([]() {
    targetWidth = WIDTH_MAX;
  });

  gripper.onClose([]() {
    targetWidth = WIDTH_MIN;
  });

  gripper.onMove([](uint8_t axisId, float target, float speed) {
    (void)axisId;
    (void)speed;
    targetWidth = target;
  });

  gripper.onDisconnect([]() {
    // Failsafe on connection loss: hold the current position.
    targetWidth = currentWidth;
  });

  gripper.begin(GRIPPER_NAME);
  Serial.println("HalberdGripper advertising as " GRIPPER_NAME);
}

void loop() {
  // Move towards the target (simple rate-limited motion so DONE fires when
  // the reported position reaches the target).
  float step = 0.01f; // m per loop iteration
  if (fabsf(currentWidth - targetWidth) > step) {
    currentWidth += (targetWidth > currentWidth) ? step : -step;
    gripper.setMoving(true);
  } else {
    currentWidth = targetWidth;
    gripper.setMoving(false);
  }
  int servoAngle = widthToAngle(currentWidth);
  float correctionFactor = 1.5f; // Adjust this factor to correct for mechanical inaccuracies in the gripper.
  servoAngle = (int)(servoAngle * correctionFactor);

  // Send the servo angle to both servos over serial for debugging (optional).
  Serial.print("Servo angle: ");Serial.print(servoAngle);Serial.println(" deg");
  finger1Servo.write(servoAngle);
  finger2Servo.write(servoAngle);

  // Feed the library: position for state/auto-DONE, grasp detection if available.
  gripper.reportPosition(0, currentWidth);
  // Stream sensor readings (replace with a real force sensor, e.g. analogRead on A0).
  gripper.reportSensor(0, dummyForceSensorValue);
  gripper.reportSensor(1, dummyForceSensorValue);
  gripper.update();

  dummyForceSensorValue += 0.1f;
  if (dummyForceSensorValue > 1024.0f) {
    dummyForceSensorValue = 0.0f;
  }

  delay(10);
}
