#include <bluefruit.h>

BLEUart bleuart;

static uint32_t heartbeatCount = 0;
static uint32_t lastHeartbeatMs = 0;

void startAdvertising()
{
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  Bluefruit.Advertising.addService(bleuart);
  Bluefruit.ScanResponse.addName();

  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);   // 20 ms to 152.5 ms
  Bluefruit.Advertising.setFastTimeout(30);     // seconds in fast mode
  Bluefruit.Advertising.start(0);               // advertise forever
}

void connect_callback(uint16_t conn_handle)
{
  BLEConnection* connection = Bluefruit.Connection(conn_handle);

  char centralName[32] = { 0 };
  connection->getPeerName(centralName, sizeof(centralName));

  Serial.print("Connected to ");
  Serial.println(centralName);
  bleuart.println("Halberd BLE UART connected");
}

void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
  (void) conn_handle;
  Serial.print("Disconnected, reason=0x");
  Serial.println(reason, HEX);
}

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  Serial.begin(115200);
  delay(500);

  Serial.println();
  Serial.println("Halberd BLE UART test");
  Serial.println("Connect with a BLE UART client and send text to echo it back.");

  Bluefruit.autoConnLed(true);
  Bluefruit.begin();
  Bluefruit.setTxPower(4);
  Bluefruit.setName("Halberd BLE Test");

  Bluefruit.Periph.setConnectCallback(connect_callback);
  Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

  bleuart.begin();
  startAdvertising();
}

void loop()
{
  while (Serial.available())
  {
    delay(2);

    uint8_t buffer[64];
    int count = Serial.readBytes(buffer, sizeof(buffer));
    bleuart.write(buffer, count);
  }

  while (bleuart.available())
  {
    uint8_t ch = (uint8_t) bleuart.read();
    Serial.write(ch);
  }

  if (Bluefruit.connected() && millis() - lastHeartbeatMs >= 1000)
  {
    lastHeartbeatMs = millis();
    heartbeatCount++;

    Serial.print("BLE heartbeat ");
    Serial.println(heartbeatCount);

    bleuart.print("HB ");
    bleuart.println(heartbeatCount);
  }
}
