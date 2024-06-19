#include "RouteHandler.h"

#include <avr/io.h>
#include <avr/pgmspace.h>
#include <util/delay.h>
#include <string.h>



class RouteHandler {
    public:
        char route[MAX_ROUTE_LENGTH];
        HandlerFunction handler;

        RouteHandler() {
            handler = nullptr;
            route[0] = '\0';
        }

        void setRoute(const char* r) {
            safeStrCopy(route, r, MAX_ROUTE_LENGTH);
        }

    private:
        void safeStrCopy(char* dest, const char* src, int maxLen) {
            int i;
            for (i = 0; i < maxLen - 1 && src[i] != '\0'; ++i) {
                dest[i] = src[i];
            }
            dest[i] = '\0';
    }
};

class RouteManager {
    private:
        RouteHandler handlers[MAX_ROUTES];

    public:
        void addRouteHandler(const char* route, HandlerFunction handler) {
            for (int i = 0; i < MAX_ROUTES; ++i) {
                if (handlers[i].handler == nullptr) {
                    handlers[i].setRoute(route);
                    handlers[i].handler = handler;
                    break;
                }
            }
        }

        void removeRouteHandler(const char* route) {
            for (int i = 0; i < MAX_ROUTES; ++i) {
                if (strcmp(handlers[i].route, route) == 0) {
                    handlers[i].route[0] = '\0';
                    handlers[i].handler = nullptr;
                    break;
                }
            }
        }

        void handleRequest(const char* route, char* result) {
            for (int i = 0; i < MAX_ROUTES; ++i) {
                if (handlers[i].handler != nullptr && strcmp(handlers[i].route, route) == 0) {
                    handlers[i].handler(result);
                    return;
                }
            }
            strcpy(result, "404 Not Found");   
        }
};