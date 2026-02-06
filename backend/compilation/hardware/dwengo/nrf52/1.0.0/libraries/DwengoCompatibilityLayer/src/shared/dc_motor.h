
#ifndef DwenguinoMotor_h
#define DwenguinoMotor_h

// DC Motor Class
class DCMotor{
	public:
		DCMotor(uint8_t motor_PWM_pin, uint8_t motor_DIR_pin);
		void init();
		void setSpeed(int speed);
		//void stopMotor(); 
	private:
		uint8_t _motor_PWM, _motor_DIR;
    int currentSpeed;
};

#endif