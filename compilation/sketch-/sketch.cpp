#include <Arduino.h>
#include <Wire.h>
#include <Dwenguino.h>
#include <LiquidCrystal.h>

void setup(){
initDwenguino();
dwenguinoLCD.setCursor(2,0);
dwenguinoLCD.print(String("WeGoSTEM ;)"));
}

void loop(){}
