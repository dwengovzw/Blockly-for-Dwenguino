
/**
 * @file Halberd_v2_nrf52.cpp
 * @brief LED register implementation for nRF52-based Halberd v2 hardware
 * 
 * This file provides the platform-specific implementation of the LED compatibility
 * layer for the Dwenguino Halberd v2 board running on the nRF52 microcontroller.
 * It implements a volatile LEDRegister class that maps bitwise operations to physical
 * LED control via GPIO pins, allowing software to interact with hardware LEDs using
 * familiar register-based operations (assignment, bitwise AND/OR/XOR, bit shifts).
 * 
 * The implementation includes:
 * - Platform initialization (GPIO setup for LED_BUILTIN pin)
 * - Overloaded operators for register-style LED control (=, |=, &=, ^=, <<=, >>=)
 * - Read/write conversion between register bits and GPIO digital states
 * 
 * @version 1.0.0
 * @date February 3, 2026
 * @author Tom Neutens
 * @copyright Dwengo vzw (www.dwengo.org)
 * @part Dwenguino Compatibility Layer
 */
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


// Map led register operations to the one physical led on the Halberd board. The LSB of the register controls the state of the LED, while the other bits are ignored.
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