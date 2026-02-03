#ifndef LED_REGISTER_H
#define LED_REGISTER_H

#include <Arduino.h>

// Map the LEDS register on AVR to a function on nRF52 using a macro. This allows the same code to work on both platforms without modification.
// Only on nrf52
class LEDRegister {
    uint8_t value;
public:
    LEDRegister() : value(0) {}
    operator uint8_t() const;
    uint8_t operator=(uint8_t v) volatile;
    uint8_t operator|=(uint8_t v) volatile;
    uint8_t operator&=(uint8_t v) volatile;
    uint8_t operator^=(uint8_t v) volatile;
    uint8_t operator<<=(uint8_t v) volatile;
    uint8_t operator>>=(uint8_t v) volatile;
};


#endif