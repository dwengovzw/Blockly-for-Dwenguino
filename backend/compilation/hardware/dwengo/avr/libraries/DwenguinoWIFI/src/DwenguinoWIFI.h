#include <string.h>
#include "RouteHandler.h"

class DwenguinoWIFI {
    public:
        bool sendCommand(String command, int timeout, String expectedResponse);
        void setupESP();
        void respondToClient(String clientID, String response);
        void handleHTTPRequest();
        RouteManager routeManager;
        DwenguinoWIFI(String ssid, String password, bool pDebug = false);
    
    private:
        String ssid;
        String password;
        bool printDebug;
        
};


