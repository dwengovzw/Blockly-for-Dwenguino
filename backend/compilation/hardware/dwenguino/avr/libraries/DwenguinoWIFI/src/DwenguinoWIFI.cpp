#include <Dwenguino.h>
#include "DwenguinoWIFI.h"

#define MAX_RESPONSE_LENGTH 100

DwenguinoWIFI::DwenguinoWIFI(String id, String pw, bool pDebug = false){
    ssid = id;
    password = pw;
    printDebug = pDebug;
    routeManager = RouteManager();
}

bool DwenguinoWIFI::sendCommand(String command, int timeout, String expectedResponse) {
    if (printDebug) {
        Serial.println("Sending command: " + command);
    }
    // Send command to ESP
    Serial1.println(command);
    long int time = millis();
    while ((time + timeout) > millis()) {
        while (Serial1.available()) {
        String response = Serial1.readString();
        if (printDebug) {
            Serial.println("Response: " + response);
        }
        if (response.indexOf(expectedResponse) != -1) {
            return true;
        }
        }
    }
    return false;
}

void DwenguinoWIFI::setupESP() {
    if (printDebug) {
        Serial.println("Printing debug: " + String(printDebug));
    }

    Serial1.begin(115200);
    delay(1000);

    // Reset the ESP-01
    DwenguinoWIFI::sendCommand("AT+RST", 1000, "ready");

    // Test communication with ESP-01
    DwenguinoWIFI::sendCommand("AT", 1000, "OK");

    // Set ESP-01 to station mode
    DwenguinoWIFI::sendCommand("AT+CWMODE=1", 1000, "OK");

    // Connect to Wi-Fi
    String connectWifi = "AT+CWJAP=\"" + String(ssid) + "\",\"" + String(password) + "\"";
    DwenguinoWIFI::sendCommand(connectWifi, 20000, "WIFI GOT IP");

    // Print the IP address assigned by DHCP
    DwenguinoWIFI::sendCommand("AT+CIFSR", 5000, "OK");

    // Set up ESP-01 as an HTTP server
    DwenguinoWIFI::sendCommand("AT+CIPMUX=1", 1000, "OK");
    DwenguinoWIFI::sendCommand("AT+CIPSERVER=1,80", 1000, "OK");
}

void DwenguinoWIFI::respondToClient(String clientID, String response) {
    String sendCommand = "AT+CIPSEND=" + clientID + "," + String(response.length());
    if (DwenguinoWIFI::sendCommand(sendCommand, 20000, ">")) {
    if (DwenguinoWIFI::sendCommand(response, 20000, "SEND OK")){
        DwenguinoWIFI::sendCommand("AT+CIPCLOSE=" + clientID, 20000, "OK");
    };
    } else {
    // Should not get to this state
    }
}

void DwenguinoWIFI::handleHTTPRequest() {
    long int timeout = 50;
    long int time = millis();
    // Check for HTTP requests for a specific timeout period.
    while ((time + timeout) > millis()) {
        while (Serial1.available()) {
            String request = Serial1.readString();

            if (printDebug) {
            Serial.println("HTTP request: " + request);
            }

            if (request.indexOf("GET /") != -1) {
                // Save the request route into a string
                String route = request.substring(request.indexOf("GET /") + 5, request.indexOf("HTTP/1.1") - 1);
                if (printDebug) {
                    Serial.println("Route: " + route);
                }

                char* responseData = new char[MAX_RESPONSE_LENGTH];
                routeManager.handleRequest(route.c_str(), responseData);

                // Construct HTTP response
                String response = "HTTP/1.1 200 OK\r\n";
                response += "Content-Type: text/plain\r\n";
                response += "Access-Control-Allow-Origin: *\r\n";
                response += "Access-Control-Allow-Methods: GET\r\n";
                response += "Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With\r\n";
                response += "Connection: close\r\n\r\n";
                response += String(responseData);


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