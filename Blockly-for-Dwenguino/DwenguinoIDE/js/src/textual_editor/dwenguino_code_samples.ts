let DwenguinoCodeSamples = {
  Blink: `
// Load library
#include <Dwenguino.h>

/*
  Welcome new users with a led animation.
*/

// The setup function runs once when you press reset or power the board.
void setup()
{
  initDwenguino();     // Initialize all Dwenguino functionality.
  pinMode(13, OUTPUT); // Set led 13 in the top left of the Dwenguino board as output.
}
// The loop function runs over and over again forever.
void loop()
{
  digitalWrite(13, HIGH); // Turn the LED on pin 13 on (HIGH is the voltage level and equals 5V).
  delay(1000);            // Wait for 1000 milliseconds, which equals 1 second.
  digitalWrite(13, LOW);  // Turn the LED on pin 13 off by making the voltage LOW (0V).
  delay(1000);            // Wait for a second.
}`,
  Bluetooth: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

/*
  Calculate the sum of two numbers over a Bluetooth connection and display the result on the display.
  Extra components needed:
  - 1 Bluetooth module
*/

void setup()
{
    initDwenguino(); // Initialize all Dwenguino functionality.
    // Open Serial1 communication with the Bluetooth module at 9600 baud rate.
    Serial1.begin(9600);

    // Write the messages to show to the user.
    dwenguinoLCD.setCursor(0, 0);
    dwenguinoLCD.print("Input: ");
    dwenguinoLCD.setCursor(0, 1);
    dwenguinoLCD.print("Sum: ");
}

void loop()
{
    // Listen for data on the serial connection.
    if (Serial1.available() > 0)
    {
        // Read in 2 real numbers.
        float a = Serial1.parseFloat();
        float b = Serial1.parseFloat();
        // Print them to the screen after "Input".
        dwenguinoLCD.setCursor(6, 0);
        dwenguinoLCD.print(a);
        dwenguinoLCD.print("+");
        dwenguinoLCD.print(b);

        // Add them together and return the result.
        float sum = a + b;
        Serial1.println(sum);
        // Print the result to the LCD after "Sum".
        dwenguinoLCD.setCursor(5, 1);
        dwenguinoLCD.print(sum);
    }
}`,
  Buttons: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

/*
  Read buttons and display the name of the buttons.
*/

// The setup function runs once when you press reset or power the board.
void setup()
{
  initDwenguino(); // Initialize all Dwenguino functionality.
}
// The loop function runs over and over again forever.
void loop()
{
  dwenguinoLCD.clear(); // Remove all text from the display.
  dwenguinoLCD.print("Buttons = ");
  // Show on the display which button is pressed
  // E.g. if the left ((W)est) button is pressed, show "West" on screen
  if (digitalRead(SW_W) == PRESSED)
  {
    dwenguinoLCD.print("West ")
  }
  if (digitalRead(SW_S) == PRESSED)
  {
    dwenguinoLCD.print("South ")
  }
  if (digitalRead(SW_E) == PRESSED)
  {
    dwenguinoLCD.print("East ")
  }
  if (digitalRead(SW_N) == PRESSED)
  {
    dwenguinoLCD.print("North ")
  }
  if (digitalRead(SW_C) == PRESSED)
  {
    dwenguinoLCD.print("Center ")
  }
  
  delay(500);
}`,
  IOBoard: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <DwenguinoIOBoard.h>
#include <Dwenguino.h>

/*
  Control the Dwengo IOBoard.
  Extra components needed:
  - 1 Dwengo IOBoard
*/

// Please note that jumper JP1-1 and JP1-2 must be set.
// Pin 14 and 15 (I2C) are reserved for communication to the IOBoard.

// Create an IOBoard object with address 0 (see jumper ADDRESS on Dwengo IO Board)
IOBoard io(0); 

void setup()
{
  // Put your setup code here, to run once:
  initDwenguino(); // Initialize all Dwenguino functionality.
  io.init(); // Initialize the IOBoard
}

void loop()
{
  // Put your main code here, to run repeatedly:
  dwenguinoLCD.clear();
  dwenguinoLCD.print("IO status = ");
  io.setOutputs(B11110000); // Switch relais on or off.
  dwenguinoLCD.print(io.readInputs());
  delay(1000);
  io.setOutputs(B00001111); // Switch relais on or off.
  delay(1000);
}`,
  Knightrider: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

/*
  Light which goes from right to left and back.
*/

void setup()
{
  initDwenguino(); // Initialize all Dwenguino functionality.
  LEDS = 0b00000001; // The horizontal row of leds is mapped to the `LEDS` variable.
}
void loop()
{
  // Shift to the left 7 times.
  // i++ is the same as i = i + 1
  for (unsigned char i = 0; i < 7; i++)
  {
    LEDS <<= 1; // Bitwise shift to the left.
    delay(50);  // Wait for 50 milliseconds.
  }
  // Shift to the right 7 times
  for (unsigned char i = 0; i < 7; i++)
  {
    LEDS >>= 1; // Bitwise shift to the right.
    delay(50);
  }
}`,
  LCD: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

/*
  Show text on the display.
*/

void setup() {
  // Put your setup code here, to run once:
  initDwenguino(); // Initialize all Dwenguino functionality.
  dwenguinoLCD.print("Hello world!"); // Show text on the display.
}
void loop() {
  // Put your main code here, to run repeatedly:

}`,
  Motors: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <DwenguinoMotor.h>
#include <Servo.h>
#include <Dwenguino.h>

/*
  Example to control a DC motor and a servo.
  Extra components needed:
  - 1 DC motor
  - 1 Servo
*/

// Construct a Servo and a DCMotor object.
Servo servo1;
DCMotor motor1(MOTOR_1_0, MOTOR_1_1); // Motor PWM pin and direction pin

int pos = 0;

// The setup function runs once when you press reset or power the board.
void setup()
{
  initDwenguino(); // Initialize all Dwenguino functionality.
  servo1.attach(SERVO_1);
}

// The loop function runs over and over again forever.
void loop()
{

  motor1.setSpeed(255); // Set speed of DC motor to rotate clockwise at full speed (=255).

  for (pos = 0; pos <= 180; pos += 3)
  {                    // Goes from 0 degrees to 180 degrees in steps of 1 degree.
    servo1.write(pos); // Tell servo to go to position in variable 'pos'.
    delay(15);         // Wait some time (15 milliseconds).
  }

  motor1.setSpeed(-255); // Set speed of DC motor to rotate counterclockwise at full speed (=-255).

  for (pos = 180; pos >= 0; pos -= 3)
  {                    // Goes from 180 degrees to 0 degrees in steps of -3 degrees.
    servo1.write(pos); // Tell servo to go to position in variable 'pos'.
    delay(15);
  }

  motor1.setSpeed(100); // Set speed of DC motor to rotate clockwise at intermediate speed.
  delay(2000);
}`,
  Music: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Pitches.h>
#include <Dwenguino.h>

/*
  Play a melody consisting of 7 notes.
*/

// The setup function runs once when you press reset or power the board.
void setup()
{
  initDwenguino(); // Initialize all the Dwenguino functions.
}
// The loop function runs over and over again forever.
void loop()
{
  dwenguinoLCD.clear(); // Remove all text from the display.
  dwenguinoLCD.print("Play some melody"); // Print some text on the LCD screen.

  // Notes in the melody in an array.
  int melody[] = {NOTE_C4, NOTE_G3, NOTE_G3, NOTE_A3, NOTE_G3, 0, NOTE_B3, NOTE_C4};
  // Note durations: 4 = quarter note, 8 = eighth note, etc.
  int noteDurations[] = {4, 8, 8, 4, 4, 4, 4, 4};
  // For loop to play the 7 notes.
  for (int thisNote = 0; thisNote < 8; thisNote++)
  {
    // To calculate the note duration, take one second
    // divided by the note type.
    // E.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000 / noteDurations[thisNote];
    // Play each note for the specified duration.
    tone(BUZZER, melody[thisNote], noteDuration);

    // To distinguish the notes, set a minimum time between them.
    // The note's duration + 30% seems to work well.
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    noTone(BUZZER); // Stop the tone playing.
  }
  delay(200);  // Wait for 200 ms for the melody to repeat.
}`,
  ReadAnalog: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

/*
  Read out analog pin.
*/

int analogPin = A0;

// The setup function runs once when you press reset or power the board.
void setup() {
  initDwenguino(); // Initialize all Dwenguino functionality.
}

// The loop function runs over and over again forever.
void loop() {
  int val;
  val = analogRead(analogPin); // Connect a voltage between 0V and 5V to this pin.
  
  dwenguinoLCD.clear();
  dwenguinoLCD.print("Value = ");
  dwenguinoLCD.print(1023-val);

  delay(100);
}`,
  SensorPlus: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <NewPing.h> // Necessary for sonar: http://playground.arduino.cc/Code/NewPing
#include <dht.h>     // Necessary for temperature sensor: https://github.com/RobTillaart/Arduino/tree/master/libraries/DHTlib and http://playground.arduino.cc/Main/DHTLib
#include <Dwenguino.h>

/*
  Dwenguino Sensors example
  Extra components needed:
  - 1 Ultrasonic sensor (sonar)
  - 1 DHT11 sensor (abbreviation for Digital Humidity and Temperature sensor)
  - 1 Microphone (sound impact sensor)
  - (color sensor)
*/

// Macro's
#define TRIGGER_PIN 12   // Dwenguino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN 11      // Dwenguino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 200 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 450cm.

#define SOUND_PIN 10 // Dwenguino pin tied to sound impact sensor output.

#define DHT11PIN 3 // Dwenguino pin tied to the DHT11 signal pin.

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // Make a sonar object.

dht DHT; // Make a "Digital Humidity and Temperature sensor" object.

void setup()
{
  // Put your setup code here, to run once:
  initDwenguino(); // Initialize all Dwenguino functionality.
  pinMode(SOUND_PIN, INPUT); // Set the sound impact sensor input pin.
}

void loop()
{
  // Put your main code here, to run repeatedly:

  // Sonar measurement when pressing North button.
  if (digitalRead(SW_N) == LOW)
  {
    unsigned int distance = sonar.ping_cm(); // Read sonar value in cm.
    dwenguinoLCD.clear();
    dwenguinoLCD.print("Sonar = ");
    dwenguinoLCD.print(distance);
    dwenguinoLCD.print(" cm");
  }

  // Temperature sensor (DHT11) measurement when pressing Center button.
  if (digitalRead(SW_C) == LOW)
  {
    int chk = DHT.read11(DHT11PIN);
    dwenguinoLCD.clear();
    dwenguinoLCD.print("Temp = ");
    dwenguinoLCD.print(DHT.temperature);
    dwenguinoLCD.print(" C");
  }

  // Sound impact sensor.
  if (digitalRead(SW_S) == LOW)
  {
    LEDS = 0;
    unsigned char sound = 0;
    for (int i = 0; i < 255; i++)
    {
      if (digitalRead(SOUND_PIN) == LOW)
      {
        sound++;
      }
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
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <DwenguinoMotor.h>
#include <Dwenguino.h>

/*
  Control two DC motors.
  Extra components needed:
  - 2 DC motors
*/

DCMotor dcMotor1(MOTOR_1_0, MOTOR_1_1); // Make a DCMotor object
DCMotor dcMotor2(MOTOR_2_0, MOTOR_2_1); // Make a DCMotor object

void setup()
{
  initDwenguino(); // Initialize all Dwenguino functionality.
}

void loop()
{
  dcMotor1.setSpeed(150);
  dcMotor2.setSpeed(150);
  delay(2500);
  dcMotor1.setSpeed(-150); // Negative numbers indicate rotating counterclockwise.
  dcMotor2.setSpeed(150);
  delay(1000);
}`,
  SweepServo: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Servo.h> // The servomotor library
#include <Dwenguino.h>

/*
  Set the angle of the servo based on the position of the potentiometer.
  Extra components needed:
  - 1 Servo
  - 1 Potentiometer, with wiper connected to A0
*/

Servo myservo; // Create servo object (myservo) to control a servo.

int potpin = A0; // Analog pin 0 used to connect the potentiometer.
int val;         // Variable to read the value from the analog pin.

void setup()
{
  initDwenguino();         // Initialize all Dwenguino functionality.
  myservo.attach(SERVO_1); // Link the myservo object to the servo pin.
}

void loop()
{
  val = analogRead(potpin);        // Reads the value of the potentiometer (value between 0 and 1023).
  val = map(val, 0, 1023, 0, 180); // Scale it to use it with the servo (angle between 0 and 180 degrees).
  myservo.write(val);              // Sets the servo angle according to the scaled value.
  delay(10);                       // Waits for the servo to get there.
}`,
  Welcome: `
// Load libraries
#include <LiquidCrystal.h>
#include <Wire.h>
#include <Dwenguino.h>

/*
  Welcome new users with text on display and a led animation.
*/

void setup()
{
  // The setup function runs once when you press reset or power the board.
  initDwenguino();     // Initialize all Dwenguino functionality.
  pinMode(13, OUTPUT); // Set led 13 in the top left of the Dwenguino board as output.

  dwenguinoLCD.clear();             // Remove all text from the display.
  dwenguinoLCD.print("Welcome to"); // Show text on the display
  dwenguinoLCD.setCursor(0, 1);     // Set cursor to first column of second row of LCD
  dwenguinoLCD.print("Dwenguino");
}
void loop()
{
  // The loop function runs over and over again forever.
  digitalWrite(13, HIGH); // Turn the LED on pin 13 on (HIGH is the voltage level and equals 5V).
  LEDS = 0b10101010;      // The horizontal row of leds is mapped to the 'LEDS' variable.
  delay(1000);            // Wait for 1000 milliseconds, which equals 1 second.
  digitalWrite(13, LOW);  // Turn the LED on pin 13 off by making the voltage LOW (0V).
  LEDS = 0b01010101;      // Assign a new led pattern to the leds
  delay(1000);            // Wait for a second.
}`

}

export default DwenguinoCodeSamples;