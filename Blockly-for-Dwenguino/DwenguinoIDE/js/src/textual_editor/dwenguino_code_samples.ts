let DwenguinoCodeSamples:any = {
    Bluetooth: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

void setup()
{
    initDwenguino();
    Serial1.begin(9600);    // Serial1 open communication with the Bluetooth module
                            // at 9600 baud rate.
    
    // Write the messages to show to the user.
    dwenguinoLCD.setCursor(0,0);
    dwenguinoLCD.print("Input: ");
    dwenguinoLCD.setCursor(0,1);
    dwenguinoLCD.print("Sum: ");
}

void loop()
{
      // Listen for data on the serial connection
    if ( Serial1.available() > 0 )
    {
        // Read in 2 real numbers
        float a = Serial1.parseFloat();
        float b = Serial1.parseFloat();
        // Print them to the screen after "Input"
        dwenguinoLCD.setCursor(6,0);
        dwenguinoLCD.print(a);
        dwenguinoLCD.print("+");
        dwenguinoLCD.print(b);
          
        // Add them together and return the result
        float sum = a + b;
        Serial1.println( sum );
        // Print the result to the LCD after "Sum"
        dwenguinoLCD.setCursor(5,1);
        dwenguinoLCD.print(sum);
    }
}`,
    Buttons: `
    #include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>
/*
  Read buttons
 */

// the setup function runs once when you press reset or power the board
void setup() {
  initDwenguino();  // initialize all dwenguino functionality
}

// the loop function runs over and over again forever
void loop() {
  
  dwenguinoLCD.clear();
  dwenguinoLCD.print("Buttons = ");
  if (digitalRead(SW_W) == PRESSED) dwenguinoLCD.print("West ");
  if (digitalRead(SW_S) == PRESSED) dwenguinoLCD.print("South ");
  if (digitalRead(SW_E) == PRESSED) dwenguinoLCD.print("East ");
  if (digitalRead(SW_N) == PRESSED) dwenguinoLCD.print("North ");
  if (digitalRead(SW_C) == PRESSED) dwenguinoLCD.print("Center ");

  delay(500);

}`,
IOBoard: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

#include <DwenguinoIOBoard.h>

// Please note that JP1-1 and JP1-2 must be set
// Pin 14 and 15 (I2C) are reserved for communication to the IOBoard

IOBoard io(0);  // create an IOBoard object with address 0 (see jumper ADDRESS on Dwengo IO Board)

void setup() {
  // put your setup code here, to run once:
  initDwenguino();
  io.init();
}

void loop() {
  // put your main code here, to run repeatedly:
  dwenguinoLCD.clear();
  dwenguinoLCD.print("IO status = ");
  io.setOutputs(B11110000);
  dwenguinoLCD.print(io.readInputs());
  delay(1000);
  io.setOutputs(B00001111);
  delay(1000);
}`,
Knightrider: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

void setup() {
  initDwenguino();
  LEDS = 0b00000001;
}
void loop() {
  for (unsigned char i=0; i<7; i++) {
    LEDS <<= 1;  // Rotate to the right
    delay(50);
  }
  for (unsigned char i=0; i<7; i++) {
    LEDS >>= 1;  // Rotate to the left
    delay(50);
  }
}`,
LCD: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

void setup() {
  // put your setup code here, to run once:
  initDwenguino();
  dwenguinoLCD.print("hello");
}

void loop() {
  // put your main code here, to run repeatedly:

}`,
Motors: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

#include <DwenguinoMotor.h>
#include <Servo.h>

// construct a Servo and a DCMotor object
Servo servo1;
DCMotor motor1(MOTOR_1_0, MOTOR_1_1);

int pos = 0;

// the setup function runs once when you press reset or power the board
void setup() {
  initDwenguino();
  servo1.attach(SERVO_1);
}

// the loop function runs over and over again forever
void loop() {

  motor1.setSpeed(255);                 // set speed of DC motor to rotate clockwise at full speed 255

  for(pos = 0; pos <= 180; pos += 3) {  // goes from 0 degrees to 180 degrees in steps of 1 degree 
    servo1.write(pos);                  // tell servo to go to position in variable 'pos' 
    delay(15);                          // wait some time
  } 

  motor1.setSpeed(-255);                // set speed of DC motor to rotate counterclockwise at full speed -255
  
  for(pos = 180; pos>=0; pos-=3) {      // goes from 180 degrees to 0 degrees                          
    servo1.write(pos);                  // tell servo to go to position in variable 'pos'  
    delay(15);         
 } 

  motor1.setSpeed(100);                 // set speed of DC motor to rotate clockwise at intermediate speed
  delay(2000);

}`,
Music: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

#include <Pitches.h>

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize all the dwenguino functions
  initDwenguino();
}

// the loop function runs over and over again forever
void loop() {
  int count = 0;  // define some variables here

  // Print something on the LCD screen:
  dwenguinoLCD.clear();
  dwenguinoLCD.print("Play some melody");
  
  int melody[] = {NOTE_C4, NOTE_G3,NOTE_G3, NOTE_A3, NOTE_G3,0, NOTE_B3, NOTE_C4}; // notes in the melody:
  int noteDurations[] = {4, 8, 8, 4, 4, 4, 4, 4}; // note durations: 4 = quarter note, 8 = eighth note, etc.:

  for (int thisNote = 0; thisNote < 8; thisNote++) {
    // to calculate the note duration, take one second 
    // divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000/noteDurations[thisNote];
    tone(BUZZER, melody[thisNote],noteDuration);
    
    // to distinguish the notes, set a minimum time between them.
    // the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    // stop the tone playing:
    noTone(BUZZER);
  }
}`,
ReadAnalog: `
/*
  Read out analog pin
  
 */

#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

int analogPin = A0;


// the setup function runs once when you press reset or power the board
void setup() {
  initDwenguino();
}

// the loop function runs over and over again forever
void loop() {
  int val;
  val = analogRead(analogPin);
  
  dwenguinoLCD.clear();
  dwenguinoLCD.print("Value = ");
  dwenguinoLCD.print(1023-val);

  delay(100);
}`,
SensorPlus: `
// Dwenguino Sensors example
// includes: Sonar , Temperature and humidity, Sound impact, Color

// standard dwenguino libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

// sensor libraries
#include <NewPing.h> // necessary for sonar: http://playground.arduino.cc/Code/NewPing
#include <dht.h> // necessary for temperature sensor: https://github.com/RobTillaart/Arduino/tree/master/libraries/DHTlib and http://playground.arduino.cc/Main/DHTLib

// macro's
#define TRIGGER_PIN  12  // Dwenguino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN     11  // Dwenguino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 200 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.

#define SOUND_PIN 10 // Dwenguino pin tied to sound impact sensor output

#define DHT11PIN 3  // Dwenguino pin tied to the DHT11 signal pin

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // make a sonar object

dht DHT; // make an DHT object

void setup() {
  // put your setup code here, to run once:
  initDwenguino();
  pinMode(SOUND_PIN, INPUT); // set the sound impact sensor input pin
}

void loop() {
  // put your main code here, to run repeatedly:

  // Sonar
  if(digitalRead(SW_N) == LOW) {
    unsigned int distance = sonar.ping_cm();  // read sonar value in cm
    dwenguinoLCD.clear();
    dwenguinoLCD.print("Sonar = ");
    dwenguinoLCD.print(distance);
    dwenguinoLCD.print(" cm");
  }

  // Temperature sensor (DHT11)
  if(digitalRead(SW_C) == LOW) {
    int chk = DHT.read11(DHT11PIN);
    dwenguinoLCD.clear();
    dwenguinoLCD.print("Temp = ");
    dwenguinoLCD.print(DHT.temperature);
    dwenguinoLCD.print(" C");
  }
  
  // sound impact
  if(digitalRead(SW_S) == LOW) {
    LEDS = 0;
    unsigned char sound = 0;
    for(int i=0;i<255;i++) {
      if(digitalRead(SOUND_PIN)==LOW)
        sound++;
      delay(1);
    }
    LEDS = sound;
    dwenguinoLCD.clear();
    dwenguinoLCD.print("Sound = ");
    dwenguinoLCD.print(sound);
  }
  delay(100);
}`,
SquareMotors: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>
#include <DwenguinoMotor.h>

DCMotor dcMotor1(MOTOR_1_0, MOTOR_1_1);
DCMotor dcMotor2(MOTOR_2_0, MOTOR_2_1);

void setup() {
  initDwenguino();
}

void loop() {
    dcMotor1.setSpeed(150);
    dcMotor2.setSpeed(150);
    delay(2500);
    dcMotor1.setSpeed(-150);
    dcMotor2.setSpeed(150);
    delay(1000);
}`,
SweepServo: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>
#include <Servo.h> // the motor library

Servo myservo; // create servo object to control a servo attached to SERVO_1
 
int potpin = 0;  // analog pin used to connect the potentiometer
int val;               // variable to read the value from the analog pin 
 
void setup() 
{ 
  initDwenguino();
  myservo.attach(SERVO_1);  // attaches the servo on pin 9 to the servo object 
  
} 
 
void loop() { 
  val = analogRead(potpin);          // reads the value of the potentiometer (value between 0 and 1023) 
  val = map(val, 0, 1023, 0, 179); // scale it to use it with the servo (value between 0 and 180) 
  myservo.write(val);       // sets the servo position according to the scaled value 
  delay(10);                                   // waits for the servo to get there 
}`,
Welcome: `
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>
/*
  Read buttons
 */

// the setup function runs once when you press reset or power the board
void setup() {
  initDwenguino();  // initialize all dwenguino functionality
  pinMode(13, OUTPUT);
  
  dwenguinoLCD.clear();
  dwenguinoLCD.print("Welcome to");
  dwenguinoLCD.setCursor(0,1);
  dwenguinoLCD.print("Dwenguino");
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  LEDS=0b10101010;
  delay(1000);              // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  LEDS=0b01010101;
  delay(1000);              // wait for a second
}`

}

export default DwenguinoCodeSamples;