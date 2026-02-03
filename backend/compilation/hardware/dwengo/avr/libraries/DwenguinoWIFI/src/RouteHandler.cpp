#include "RouteHandler.h"

#include <avr/io.h>
#include <avr/pgmspace.h>
#include <util/delay.h>
#include <string.h>


RouteHandler::RouteHandler() {
    handler = nullptr;
    route[0] = '\0';
};

void RouteHandler::setRoute(const char* r) {
    RouteHandler::safeStrCopy(route, r, MAX_ROUTE_LENGTH);
};

void RouteHandler::safeStrCopy(char* dest, const char* src, int maxLen) {
    int i;
    for (i = 0; i < maxLen - 1 && src[i] != '\0'; ++i) {
        dest[i] = src[i];
    }
    dest[i] = '\0';
};


RouteManager::RouteManager() {
    for (int i = 0; i < MAX_ROUTES; ++i) {
        handlers[i] = RouteHandler();
    }
};

void RouteManager::addRouteHandler(const char* route, HandlerFunction handler) {
    for (int i = 0; i < MAX_ROUTES; ++i) {
        if (handlers[i].handler == nullptr) {
            handlers[i].setRoute(route);
            handlers[i].handler = handler;
            break;
        }
    }
}

void RouteManager::removeRouteHandler(const char* route) {
    for (int i = 0; i < MAX_ROUTES; ++i) {
        if (strcmp(handlers[i].route, route) == 0) {
            handlers[i].route[0] = '\0';
            handlers[i].handler = nullptr;
            break;
        }
    }
}

void RouteManager::handleRequest(const char* route, char* result) {
    // split query from route
    const char* query = strchr(route, '?'); // find the first occurence of '?'
    // copy of route to modify
    char routeCopy[MAX_ROUTE_LENGTH];
    strcpy(routeCopy, route); 
    // if query is not null, split route and query
    if (query != nullptr) {
        strcpy(routeCopy, route);
        routeCopy[query - route] = '\0';
        query++; // skip the '?'
    }
    for (int i = 0; i < MAX_ROUTES; ++i) {
        if (handlers[i].handler != nullptr && strcmp(handlers[i].route, routeCopy) == 0) {
            handlers[i].handler(query, result);
            return;
        }
    }
    strcpy(result, "404 Not Found");   
}
