#include <Dwenguino.h>
#include "DwenguinoWIFI.h"

DwenguinoWIFI::DwenguinoWIFI(String id, String pw){
    ssid = id;
    password = pw;
}

bool DwenguinoWIFI::sendCommand(String command, int timeout, String expectedResponse) {
  // Send command to ESP
  Serial1.println(command);
  long int time = millis();
  while ((time + timeout) > millis()) {
    while (Serial1.available()) {
      String response = Serial1.readString();
      if (response.indexOf(expectedResponse) != -1) {
        return true;
      }
    }
  }
  return false;
}

void DwenguinoWIFI::setupESP() {
  Serial1.begin(115200);
  delay(1000);

  // Test communication with ESP-01
  sendCommand("AT", 1000, "OK");

  // Set ESP-01 to station mode
  sendCommand("AT+CWMODE=1", 1000, "OK");

  // Connect to Wi-Fi
  String connectWifi = "AT+CWJAP=\"" + String(ssid) + "\",\"" + String(password) + "\"";
  sendCommand(connectWifi, 20000, "WIFI GOT IP");

  // Print the IP address assigned by DHCP
  sendCommand("AT+CIFSR", 5000, "OK");

  // Set up ESP-01 as an HTTP server
  sendCommand("AT+CIPMUX=1", 1000, "OK");
  sendCommand("AT+CIPSERVER=1,80", 1000, "OK");
}

void DwenguinoWIFI::respondToClient(String clientID, String response) {
  String sendCommand = "AT+CIPSEND=" + clientID + "," + String(response.length());
  if (DwenguinoWIFI::sendCommand(sendCommand, 20000, ">")) {
    if (DwenguinoWIFI::sendCommand(response, 20000, "SEND OK")){
      DwenguinoWIFI::sendCommand("AT+CIPCLOSE=" + clientID, 20000, "OK");
    };
  } else {
    Serial.println("Error in sending response");
  }
}

void DwenguinoWIFI::handleHTTPRequest() {
  long int timeout = 500;
  long int time = millis();
  // Check for HTTP requests for a specific timeout period.
  while ((time + timeout) > millis()) {
    if (Serial1.available()) {
      String request = Serial1.readString();
      Serial.println("HTTP request: " + request);

      if (request.indexOf("GET /sensor") != -1) {
        // Collect sensor data (dummy data in this example)
        String sensorData = "23.5";

        // Construct HTTP response
        String response = "HTTP/1.1 200 OK\r\n";
        response += "Content-Type: text/plain\r\n";
        response += "Connection: close\r\n\r\n";
        response += "Sensor Data: " + sensorData;

        // Extract client ID from the request
        int clientIDStart = request.indexOf("+IPD,") + 5;
        int clientIDEnd = request.indexOf(",", clientIDStart);
        String clientID = request.substring(clientIDStart, clientIDEnd);

        // Respond to the client with the sensor data
        respondToClient(clientID, response);
      }
    }
  }
}