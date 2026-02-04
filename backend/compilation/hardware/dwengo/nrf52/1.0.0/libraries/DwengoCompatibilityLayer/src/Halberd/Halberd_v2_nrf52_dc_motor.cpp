#include "Halberd_v2_nrf52_dc_motor.h"
#include "../shared/dc_motor.h"
#include <Arduino.h>

DCMotor::DCMotor(uint8_t motor_PWM_pin, uint8_t motor_DIR_pin) 
    : _motor_PWM(motor_PWM_pin), _motor_DIR(motor_DIR_pin), currentSpeed(0) {
}

void DCMotor::init() {
    Serial.println("DC Motor initialized - PWM pin: " + String(_motor_PWM) + ", DIR pin: " + String(_motor_DIR));
}

void DCMotor::setSpeed(int speed) {
    currentSpeed = speed;
    int direction = (speed >= 0) ? 1 : 0;
    int pwmValue = abs(speed);
    
    Serial.print("Setting motor speed: ");
    Serial.print(speed);
    Serial.print(" (PWM: ");
    Serial.print(pwmValue);
    Serial.print(", Direction: ");
    Serial.print(direction);
    Serial.println(")");
}