
/* ---------------------------------------------------------------------------
	Dwenguino Compatibility Layer - v1.0.0
	
	Created on Feb 3 2026 by Tom Neutens from Dwengo vzw (www.dwengo.org)


* --------------------------------------------------------------------------- */


#include "../shared/Led_register.h"
#include "Halberd_v2_nrf52.h"

// Define the global LED register instance
volatile LEDRegister LEDS;

void initPlatform() {
    // initialize Leds
    pinMode(LED_BUILTIN, OUTPUT); // Set LED pin as output
    LEDS = 0; // Initialize to 0
}

uint8_t LEDRegister::operator=(uint8_t v) volatile {
    value = v;
    // Map the LSB of v to the LED_PIN on Halberd
    digitalWrite(LED_BUILTIN, (v & 0x01) ? HIGH : LOW);
    return v;
}

uint8_t LEDRegister::operator|=(uint8_t v) volatile {
    value |= v;
    digitalWrite(LED_BUILTIN, (value & 0x01) ? HIGH : LOW);
    return value;
}

uint8_t LEDRegister::operator&=(uint8_t v) volatile {
    value &= v;
    digitalWrite(LED_BUILTIN, (value & 0x01) ? HIGH : LOW);
    return value;
}

uint8_t LEDRegister::operator^=(uint8_t v) volatile {
    value ^= v;
    digitalWrite(LED_BUILTIN, (value & 0x01) ? HIGH : LOW);
    return value;
}

uint8_t LEDRegister::operator<<=(uint8_t v) volatile {
    value <<= v;
    digitalWrite(LED_BUILTIN, (value & 0x01) ? HIGH : LOW);
    return value;
}

uint8_t LEDRegister::operator>>=(uint8_t v) volatile {
    value >>= v;
    digitalWrite(LED_BUILTIN, (value & 0x01) ? HIGH : LOW);
    return value;
}

LEDRegister::operator uint8_t() const {
    //return readGPIO(); // Read pins and map to bits
    uint8_t value = 0;
    // Map the LED_PIN on Halberd to the LSB of value
    value |= (digitalRead(LED_BUILTIN) == HIGH) ? 0x01 : 0x00;
    return value;
} 