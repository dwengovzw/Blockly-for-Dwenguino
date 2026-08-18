/**
 * Read both sensors on the HalberdGripper sensor module:
 *  - the analog pressure sensor (on analog pin A0), and
 *  - the VL53L4CD time-of-flight distance sensor.
 *
 * Wiring:
 *  - sensor module SDA/SCL -> Halberd SDA/SCL or SDA2/SCL2.
 *  - pressure sensor output -> A0.
 *
 * Readings are printed on the serial monitor at 115200 baud.
 */
#include <HalberdGripperSensor.h>
#include <Arduino.h>

HalberdGripperSensor sensorsWire(PIN_A0, Wire);
HalberdGripperSensor sensorsWire1(PIN_A0, Wire1);
HalberdGripperSensor* sensors = nullptr;
const char* activeBusName = "none";
const bool kEnableSensorDebug = false;

void printInitFailure(const char* busName, HalberdGripperSensor& candidate) {
  Serial.print(busName);
  Serial.print(" init failed: stage=");
  Serial.print(candidate.tof().lastErrorStage());
  Serial.print(", wire_error=");
  Serial.print(candidate.tof().lastWireError());
  Serial.print(", model_id=0x");
  Serial.println(candidate.tof().lastModelId(), HEX);
}

void setup() {

  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  pinMode(PIN_A0, INPUT);
  
  Serial.begin(115200);

  // Turn LEDS off
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_RED, LOW);
  digitalWrite(LED_BLUE, LOW);

  while (!Serial) {
    delay(10);
    // Blink the LED while waiting for the serial monitor to open.
    digitalWrite(LED_RED, millis() % 500 < 250 ? HIGH : LOW);
  }

  sensorsWire.setDebugOutput(kEnableSensorDebug);
  sensorsWire1.setDebugOutput(kEnableSensorDebug);
  // Optional tuning APIs:
  // sensorsWire.setRangeTimingMs(100, 0);   // faster updates, less averaging
  // sensorsWire1.setRangeTimingMs(100, 0);
  // sensorsWire.setDistanceOffsetMm(-3);    // close-range calibration offset
  // sensorsWire1.setDistanceOffsetMm(-3);

  if (sensorsWire1.begin()) {
    sensors = &sensorsWire1;
    activeBusName = "Wire1";
  } else if (sensorsWire.begin()) {
    sensors = &sensorsWire;
    activeBusName = "Wire";
  }

  if (sensors == nullptr) {
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, HIGH);
    digitalWrite(LED_BLUE, LOW);
    Serial.println("VL53L4CD time-of-flight sensor not found, check wiring!");
    printInitFailure("Wire1", sensorsWire1);
    printInitFailure("Wire ", sensorsWire);
  } else {
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_BLUE, LOW);
    Serial.print("VL53L4CD detected on ");
    Serial.print(activeBusName);
    Serial.println(".");
  }
}

void loop() {
  if (sensors == nullptr) {
    delay(250);
    return;
  }

  // Pressure sensor: simple analog read, available at any time.
  float pressureVolts = sensors->readPressureVoltage();

  // Time-of-flight sensor: default timing is 200 ms (~5x per second).
  uint16_t distanceMm;
  if (sensors->readDistance(distanceMm)) {
    Serial.print("Pressure: ");
    Serial.print(pressureVolts, 3);
    Serial.print(" V  |  Distance: ");
    Serial.print(distanceMm);
    Serial.println(" mm");
  }

  // Also show raw ADC values for the pressure sensor during bring-up.
  int analogValue = sensors->readPressureRaw();
  Serial.print("Pressure raw: ");
  Serial.println(analogValue);

  // Blink Blue while the loop is alive.
    digitalWrite(LED_BLUE, HIGH);
    delay(100);
    digitalWrite(LED_BLUE, LOW);
    delay(100);

  delay(10);
}
