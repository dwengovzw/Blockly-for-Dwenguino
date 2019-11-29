#include <Arduino.h>
#include <Wire.h>

#include <Dwenguino.h>

#include <LiquidCrystal.h>

void setup()
{
  initDwenguino();

}


void loop()
{
    LEDS = 0b01010101;

}