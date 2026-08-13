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

// Gripper geometry (Robotiq 2F-85-like: 0 .. 85 mm opening)
#define WIDTH_MIN 0.0f
#define WIDTH_MAX 0.085f
#define MAX_SPEED 0.15f   // m/s, informational

// Servo angles corresponding to fully closed / fully open
#define ANGLE_CLOSED 10
#define ANGLE_OPEN   170

HalberdGripper gripper;
Servo fingerServo;

float targetWidth = WIDTH_MAX;
float currentWidth = WIDTH_MAX;

int widthToAngle(float width) {
  float t = (width - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN);
  return ANGLE_CLOSED + (int)(t * (ANGLE_OPEN - ANGLE_CLOSED));
}

void setup() {
  Serial.begin(115200);

  fingerServo.attach(SERVO_1);

  // One axis: the finger opening in meters (profile "parallel" is the default).
  gripper.configureAxis(0, WIDTH_MIN, WIDTH_MAX, MAX_SPEED);

  float openPose[]   = { WIDTH_MAX };
  float closedPose[] = { WIDTH_MIN };
  gripper.definePose("open", openPose);
  gripper.definePose("closed", closedPose);

  // Sensors declared here show up in the descriptor and stream to airo-mono.
  gripper.configureSensor(0, "force", "N", 0.0f, 250.0f);

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
  float step = 0.001f; // m per loop iteration
  if (fabsf(currentWidth - targetWidth) > step) {
    currentWidth += (targetWidth > currentWidth) ? step : -step;
    gripper.setMoving(true);
  } else {
    currentWidth = targetWidth;
    gripper.setMoving(false);
  }
  fingerServo.write(widthToAngle(currentWidth));

  // Feed the library: position for state/auto-DONE, grasp detection if available.
  gripper.reportPosition(0, currentWidth);
  // Stream sensor readings (replace with a real force sensor, e.g. analogRead on A0).
  gripper.reportSensor(0, 0.0f);
  gripper.update();

  delay(10);
}
