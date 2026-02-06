#ifndef HALBERD_V2_NRF52_H
#define HALBERD_V2_NRF52_H

/**
 * \file Halberd_v2_nrf52.h
 * \brief Halberd v2 board specific definitions for nRF52 platform compatible with Dwenguino code.
 * \details This file maps the Halberd v2 board pin definitions to the Dwenguino pin definitions
 *          to allow existing Dwenguino code to run on the Halberd v2. Since Halberd v2 does not have
 *          all the same hardware features as Dwenguino, some pins are mapped to unused pins on Halberd.
 */

// Digital pin aliases for compatibility with Dwenguino code.
// SERVO_1 to SERVO_4 correspond to actual servo connectors on Halberd board.
#define SERVO_5 D4 // No actual servo connector on this pin on Halberd
#define SERVO_6 D5 // No actual servo connector on this pin on Halberd

// Define default pins to attach buttons to.
// These pins don't actually have buttons on Halberd board.
#define SW_N D13
#define SW_E D12
#define SW_S D11
#define SW_W D10
#define SW_C D9

// Convert the RBG LED pins on the Dwenguino to the Halberd LED pins.
#define RGB_1_R LED_R
#define RGB_1_G LED_G
#define RGB_1_B LED_B

// Convert SPI pins on Dwenguino to Halberd SPI pins
#define SPI_MOSI PIN_SPI_MOSI
#define SPI_MISO PIN_SPI_MISO
#define SPI_SCK  PIN_SPI_SCK
#define SPI_SS   PIN_SPI_SS

// Map buzzer pin to D8 even though there is no buzzer on Halberd board.
#define BUZZER D8

// Map sonar pin definions to Halberd pins even though there is no sonar on Halberd board.
#define SONAR_1_TRIG A1
#define SONAR_1_ECHO A0
#define SONAR_2_TRIG A3
#define SONAR_2_ECHO A2

// Map sound sensor pin to Halberd pin even though there is no sound sensor on Halberd board.
#define SOUND_SENSOR A4

// Map all led pins to the built-in led on Halberd board.
#define LED_0   LED_BUILTIN
#define LED_1   LED_BUILTIN
#define LED_2   LED_BUILTIN
#define LED_3   LED_BUILTIN
#define LED_4   LED_BUILTIN
#define LED_5   LED_BUILTIN
#define LED_6   LED_BUILTIN
#define LED_7   LED_BUILTIN

// Map DC-motor pins to Halberd pins even though there are no DC-motor connectors on Halberd board.
#define MOTOR_0_0 A5 // PWM pin to set speed
#define MOTOR_0_1 D8 // Direction pin
#define MOTOR_1_0 A6 // PWM pin to set speed
#define MOTOR_1_1 D7 // Direction pin


// Halberd-specific features
void initPlatform();

extern volatile LEDRegister LEDS; // Global LED register instance


#endif