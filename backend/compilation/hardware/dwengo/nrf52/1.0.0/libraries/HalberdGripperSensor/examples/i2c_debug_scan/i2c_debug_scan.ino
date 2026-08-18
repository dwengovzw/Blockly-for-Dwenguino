/**
 * I2C debug scanner for the HalberdGripper sensor module (v2).
 *
 * The nRF52 TWIM peripheral does NOT support zero-length writes, so the
 * classic beginTransmission()/endTransmission() address scan is unreliable
 * on this chip. This sketch instead:
 *
 *   1. checks the electrical idle level of the SDA/SCL lines of both buses
 *      (a healthy idle I2C line reads HIGH; a line stuck LOW means a short,
 *      a missing connection, or a device holding the bus);
 *   2. scans both buses using 1-byte READS (a NACKed read returns 0 bytes);
 *   3. probes the VL53L4CD model-ID register (0x010F) at address 0x29 on
 *      both buses; a working sensor answers 0xEBAA.
 *
 * Output on the serial monitor at 115200 baud.
 */
#include <Arduino.h>
#include <Wire.h>

void checkLineLevels(const char* name, uint8_t sdaPin, uint8_t sclPin) {
  pinMode(sdaPin, INPUT_PULLUP);
  pinMode(sclPin, INPUT_PULLUP);
  delay(2);
  int sda = digitalRead(sdaPin);
  int scl = digitalRead(sclPin);
  Serial.print(name);
  Serial.print(" idle levels: SDA=");
  Serial.print(sda ? "HIGH (ok)" : "LOW  (!!)");
  Serial.print("  SCL=");
  Serial.println(scl ? "HIGH (ok)" : "LOW  (!!)");
  if (!sda || !scl) {
    Serial.println("  -> line stuck LOW: short to GND, sensor holding the bus,");
    Serial.println("     or missing connection. I2C cannot work like this.");
  }
}

void scanBusWithReads(TwoWire& bus, const char* name) {
  Serial.print("Read-scanning ");
  Serial.print(name);
  Serial.println(" ...");

  uint8_t found = 0;
  for (uint8_t address = 0x08; address <= 0x77; address++) {
    // 1-byte read: a present device ACKs its address and returns a byte.
    if (bus.requestFrom(address, (size_t)1) > 0) {
      if (bus.available()) bus.read();
      Serial.print("  device found at 0x");
      if (address < 16) Serial.print('0');
      Serial.print(address, HEX);
      if (address == 0x29) Serial.print("  <-- VL53L4CD!");
      Serial.println();
      found++;
    }
  }
  if (found == 0) {
    Serial.println("  no devices found");
  }
}

void probeVL53L4CD(TwoWire& bus, const char* name) {
  // Read the 16-bit model-ID register 0x010F; the VL53L4CD answers 0xEBAA.
  bus.beginTransmission(0x29);
  bus.write((uint8_t)0x01);
  bus.write((uint8_t)0x0F);
  uint8_t err = bus.endTransmission(false); // repeated start
  if (err != 0) {
    Serial.print(name);
    Serial.print(": no ACK from 0x29 (endTransmission err=");
    Serial.print(err);
    Serial.println(")");
    return;
  }
  if (bus.requestFrom((uint8_t)0x29, (size_t)2) != 2) {
    Serial.print(name);
    Serial.println(": address ACKed but read failed");
    return;
  }
  uint16_t id = ((uint16_t)bus.read() << 8) | bus.read();
  Serial.print(name);
  Serial.print(": VL53L4CD model id = 0x");
  Serial.print(id, HEX);
  Serial.println(id == 0xEBAA ? "  (correct!)" : "  (unexpected)");
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(10);
  }

  Serial.println("--- line level check (before Wire.begin) ---");
  checkLineLevels("Wire  (SDA=D16/P1.08, SCL=D15/P1.09)", PIN_WIRE_SDA, PIN_WIRE_SCL);
  checkLineLevels("Wire1 (SDA=D5/P0.14,  SCL=D6/P0.15) ", PIN_WIRE1_SDA, PIN_WIRE1_SCL);

  Wire.begin();
  Wire1.begin();
}

void loop() {
  Serial.println("=================================");
  scanBusWithReads(Wire,  "Wire  (SDA=D16/P1.08, SCL=D15/P1.09)");
  scanBusWithReads(Wire1, "Wire1 (SDA=D5/P0.14,  SCL=D6/P0.15)");
  Serial.println("--- direct VL53L4CD probe at 0x29 ---");
  probeVL53L4CD(Wire,  "Wire ");
  probeVL53L4CD(Wire1, "Wire1");
  delay(2000);
}
