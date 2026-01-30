/*
  Copyright (c) 2014-2015 Arduino LLC.  All right reserved.
  Copyright (c) 2016 Sandeep Mistry All right reserved.
  Copyright (c) 2018, Adafruit Industries (adafruit.com)

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

#include "variant.h"
#include "wiring_constants.h"
#include "wiring_digital.h"
#include "nrf.h"


const uint32_t g_ADigitalPinMap[] =
{
  // D0 .. D16
  6,   // D0  is P0.06 (SERVO1)
  25,  // D1  is P0.25 (SERVO2 
  9,   // D2  is P0.09 (SERVO3)
  24,  // D3  is P0.24 (SERVO4)
  27,  // D4  is P0.27 
  14,  // D5  is P0.14 (SDA2)
  15,  // D6  is P0.15 (SCL2)
  45,  // D7  is P1.13 
  44,  // D8  is P1.12 
  43,  // D9  is P1.11
  42,  // D10 is P1.10
  35,  // D11 is P1.03 (SPI_SS)
  47,  // D12 is P1.15 (Serial 1 TX)
  46,  // D13 is P1.14 (Serial 1 RX)
  11,  // D14 is P0.11 (SCK)
  41,  // D15 is P1.09 (SCL/MOSI)
  40,  // D16 is P1.08 (SDA/MISO)
  5,   // A0 is P0.05
  4,   // A1 is P0.04
  30,  // A2 is P0.30
  29,  // A3 is P0.29
  31,  // A4 is P0.31
  2,   // A5 is P0.02
  28,  // A6 is P0.28
  3,   // A7 is P0.03
  17,  // RGB_LED_R
  20,  // RGB_LED_G
  13,  // RGB_LED_B
};

void initVariant()
{

}

