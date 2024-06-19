#define MAX_ROUTES 10
#define MAX_ROUTE_LENGTH 20

typedef void (*HandlerFunction)(char*);

class RouteHandler {
public:
    char route[MAX_ROUTE_LENGTH];
    HandlerFunction handler;
    void setRoute(const char* r);
};

class RouteManager {
    private:
        RouteHandler handlers[MAX_ROUTES];
        void safeStrCopy(char* dest, const char* src, int maxLen);

    public:
        void addRouteHandler(const char* route, HandlerFunction handler);
        void removeRouteHandler(const char* route);
        void handleRequest(const char* route);
        
};