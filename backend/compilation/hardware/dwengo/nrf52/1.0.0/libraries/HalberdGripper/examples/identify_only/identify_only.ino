/**
 * Minimal BLE identify example. No gripper hardware is required.
 *
 * From Python:
 *   from airo_robots.grippers import HalberdBLEGripper
 *   gripper = HalberdBLEGripper.connect(name="my-first-gripper")
 *   try:
 *       gripper.identify()
 *   finally:
 *       gripper.disconnect()
 *
 * The axis is a placeholder required by HalberdBLEGripper. This sketch does
 * not control servos or implement gripper movement.
 */
#include <HalberdGripper.h>

HalberdGripper gripper;

void setup() {
  Serial.begin(115200);

  gripper.configureAxis(0, 0.0f, 0.079f, 0.25f);

  if (!gripper.begin("my-first-gripper")) {
    Serial.println("Failed to start HalberdGripper BLE");
    while (true) {
      delay(1000);
    }
  }
  Serial.println("HalberdGripper advertising as my-first-gripper");
}

void loop() {
  gripper.update();
  delay(10);
}
