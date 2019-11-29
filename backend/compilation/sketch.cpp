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
    dwenguinoLCD.setCursor(0,0);
    dwenguinoLCD.print(String("Hallo Dwenguino"));

}