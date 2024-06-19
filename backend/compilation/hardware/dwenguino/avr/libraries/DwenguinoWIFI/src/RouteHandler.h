#define MAX_ROUTES 10
#define MAX_ROUTE_LENGTH 20

typedef void (*HandlerFunction)(const char* route, char* result);

class RouteHandler {
public:
    char route[MAX_ROUTE_LENGTH];
    HandlerFunction handler;
    RouteHandler();
    void setRoute(const char* r);
    void safeStrCopy(char* dest, const char* src, int maxLen);
};

class RouteManager {
    private:
        RouteHandler handlers[MAX_ROUTES];

    public:
        RouteManager();
        void addRouteHandler(const char* route, HandlerFunction handler);
        void removeRouteHandler(const char* route);
        void handleRequest(const char* route, char* result);
        
};