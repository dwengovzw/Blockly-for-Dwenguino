 /*
  Copyright (c) 2025 Dwengo

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.
  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Lesser General Public License for more details.
  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

#ifndef _VARIANT_DWENGO_HALBERD_
#define _VARIANT_DWENGO_HALBERD_

/** Master clock frequency */
#define VARIANT_MCK       (64000000ul)

// Frequency of the board main oscillator
#define VARIANT_MAINOSC (32768ul)

#define USE_LFXO      // Board uses 32khz crystal for LF
// define USE_LFRC    // Board uses RC for LF

/*----------------------------------------------------------------------------
 *        Headers
 *----------------------------------------------------------------------------*/

#include "WVariant.h"

#ifdef __cplusplus
extern "C"
{
#endif // __cplusplus

// Number of pins defined in PinDescription array <- OK
#define PINS_COUNT           (28u)
#define NUM_DIGITAL_PINS     (28u)
#define NUM_ANALOG_INPUTS    (8u) 
#define NUM_ANALOG_OUTPUTS   (8u)

// LEDs <- OK

#define PIN_LED_R            (25u)
#define PIN_LED_G            (26u)
#define PIN_LED_B            (27u)
#define PIN_LED              (LED_G)

#define LED_BUILTIN          PIN_LED

#define LED_RED              PIN_LED_R
#define LED_BLUE             PIN_LED_B
#define LED_GREEN            PIN_LED_G

#define LED_R		     LED_RED
#define LED_G		     LED_GREEN
#define LED_B 		     LED_BLUE

#define LED_STATE_ON         1         // State when LED is lit

/*
 * Buttons <- TODO
 */
#define PIN_BUTTON1          (7u)

/*
 * Analog pins <- OK
 */
#define PIN_A0               (17u)
#define PIN_A1               (18u)
#define PIN_A2               (19u)
#define PIN_A3               (20u)
#define PIN_A4               (21u)
#define PIN_A5               (22u)
#define PIN_A6               (23u)
#define PIN_A7               (24u)
static const uint8_t A0  = PIN_A0 ;
static const uint8_t A1  = PIN_A1 ;
static const uint8_t A2  = PIN_A2 ;
static const uint8_t A3  = PIN_A3 ;
static const uint8_t A4  = PIN_A4 ;
static const uint8_t A5  = PIN_A5 ;
static const uint8_t A6  = PIN_A6 ;
static const uint8_t A7  = PIN_A7 ;

#define ADC_RESOLUTION    12

/*
 *  Digital pins
 */
 
#define D0  (0u)
#define D1  (1u)
#define D2  (2u)
#define D3  (3u)
#define D4  (4u)
#define D5  (5u)
#define D6  (6u)
#define D7  (7u)
#define D8  (8u)
#define D9  (9u)
#define D10 (10u)
#define D11 (11u)
#define D12 (12u)
#define D13 (13u)
#define D14 (14u)
#define D15 (15u)
#define D16 (16u)



// Other pins <- TODO: check and remove
#define PIN_AREF           PIN_A7
#define PIN_VBAT           PIN_A6
#define PIN_NFC1           (33u)
#define PIN_NFC2           (2u)

static const uint8_t AREF = PIN_AREF;

/*
 * Serial interfaces <- TODO
 */
#define PIN_SERIAL1_RX       (13u)
#define PIN_SERIAL1_TX       (12u)

/*
 * SPI Interfaces <- OK
 */
#define SPI_INTERFACES_COUNT 1
#define PIN_SPI_MISO         (16u)
#define PIN_SPI_MOSI         (15u)
#define PIN_SPI_SCK          (14u)
#define PIN_SPI_SS           (11u)

static const uint8_t SS   = (4);  // Set default slave select to D4
static const uint8_t MOSI = PIN_SPI_MOSI ;
static const uint8_t MISO = PIN_SPI_MISO ;
static const uint8_t SCK  = PIN_SPI_SCK ;

/*
 * Wire Interfaces <- OK
 */
#define WIRE_INTERFACES_COUNT 2

#define PIN_WIRE_SDA         (16u)
#define PIN_WIRE_SCL         (15u)

#define PIN_WIRE1_SDA        (5u)
#define PIN_WIRE1_SCL        (6u)

#define PIN_ENABLE_WIRE_PULLUP      (28u)
#define PIN_ENABLE_WIRE1_PULLUP      (29u)


#ifdef __cplusplus
}
#endif

/*----------------------------------------------------------------------------
 *        Arduino objects - C++ only
 *----------------------------------------------------------------------------*/

#endif
