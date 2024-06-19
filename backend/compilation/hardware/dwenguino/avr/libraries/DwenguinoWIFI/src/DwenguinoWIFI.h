#include <string.h>

class DwenguinoWIFI {
    public:
        bool sendCommand(String command, int timeout, String expectedResponse);
        void setupESP();
        void respondToClient(String clientID, String response);
        void handleHTTPRequest();
        DwenguinoWIFI(String ssid, String password);
    
    private:
        String ssid;
        String password;
        
};


