/**
 * @file LedControllerDemoHwSPI.ino
 * @author Noa Sakurajin (noasakurajin@web.de)
 * @brief LedControllerDemoRocket.ino with hardware spi
 * @version 0.1
 * @date 2020-12-30
 * 
 * @copyright Copyright (c) 2020
 * 
 */

#include "LedController.hpp"

#define CS 15
#define Segments 4

#define delayTime 200 // Delay between Frames

LedController<Segments,1> lc = LedController<Segments,1>();  

ByteBlock rocket= {
  B00000000,
  B00001111,
  B00111110,
  B11111101,
  B00111110,
  B00001111,
  B00000000,
  B00000000
};

ByteBlock rocketColumns;

//sets all rows on all displays to 0
void switchLED(){
  static bool LEDON = false;
  if(LEDON){
    digitalWrite(13, LOW);
  }else{
    digitalWrite(13, HIGH);
  }
  LEDON = !LEDON;
}

void setup(){
  lc.init(CS);// Pins: CS, # of Display connected

  lc.makeColumns(rocket, &rocketColumns);

  pinMode(13, OUTPUT);

  lc.setIntensity(0);
    
}

void loop(){
  
    lc.clearMatrix();
    
    //Let the rocket fly in
    for(int i = 0;i < 8*(Segments+1);i++){
      delay(delayTime);

      //blink led for each iteration
      switchLED();

      //if rocket not fully inside let it fly in and shift it
      if(i < 8){
        lc.moveRight(rocketColumns[i]);   
      }else{
        lc.moveRight();

        delay(delayTime);
        switch(i % 6){
          case(3):
          case(4):
          case(5):
            lc.moveUp();
            break;

          case(0):
          case(1):
          case(2):
            lc.moveDown();
            break;

          default:
            break;
        }
      }
         
    }

    delay(delayTime);

    for(int i = 0;i < 8*(Segments+1);i++){
      delay(delayTime);

      //blink led for each iteration
      switchLED();

      //if rocket not fully inside let it fly in and shift it
      if(i < 8){
        lc.moveLeft(rocketColumns[i]);   
      }else{
        lc.moveLeft();

        delay(delayTime);
        switch(i % 6){
          case(3):
          case(4):
          case(5):
            lc.moveUp();
            break;

          case(0):
          case(1):
          case(2):
            lc.moveDown();
            break;

          default:
            break;
        }
      }
         
    }

    delay(delayTime);

}
