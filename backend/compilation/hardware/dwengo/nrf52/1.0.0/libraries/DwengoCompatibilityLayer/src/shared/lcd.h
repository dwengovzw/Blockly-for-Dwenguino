/* ---------------------------------------------------------------------------
	Dwenguino Compatibility Layer - v1.0.0
	
	Created on Feb 3 2026 by Tom Neutens from Dwengo vzw (www.dwengo.org)


* --------------------------------------------------------------------------- */

#ifndef DwenguinoLCD_h
#define DwenguinoLCD_h

#include <Arduino.h>


// LCD
class BufferedLCD{
public:
	void clear();
    void backlightOn(void);
    void backlightOff(void);
	virtual size_t write(uint8_t);
	void command(uint8_t);
    void init(uint8_t fourbitmode, uint8_t rs, uint8_t rw, uint8_t enable,
	    uint8_t d0, uint8_t d1, uint8_t d2, uint8_t d3,
	    uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7);
    
    void begin(uint8_t cols, uint8_t rows, uint8_t charsize);

    void home();

    void noDisplay();
    void display();
    void noBlink();
    void blink();
    void noCursor();
    void cursor();
    void scrollDisplayLeft();
    void scrollDisplayRight();
    void leftToRight();
    void rightToLeft();
    void autoscroll();
    void noAutoscroll();

    void createChar(uint8_t, uint8_t[]);
    void setCursor(uint8_t, uint8_t); 
    size_t print(const __FlashStringHelper *ifsh);
    size_t print(const String &s);
    size_t print(const char str[]);
    size_t print(char c);
    size_t print(unsigned char b, int base = 10);
    size_t print(int n, int base = 10);
    size_t print(unsigned int n, int base = 10);
    size_t print(long n, int base = 10);
    size_t print(unsigned long n, int base = 10);
    size_t print(double n, int digits = 2);
    size_t print(const Printable &x);
    size_t println(const __FlashStringHelper *ifsh);
    size_t println(const String &s);
    size_t println(const char c[]);
    size_t println(char c);
    size_t println(unsigned char b, int base = 10);
    size_t println(int num, int base = 10);
    size_t println(unsigned int num, int base = 10);
    size_t println(long num, int base = 10);
    size_t println(unsigned long num, int base = 10);
    size_t println(double num, int digits = 2);
    size_t println(const Printable &x);
    size_t println(void);

};
extern BufferedLCD dwenguinoLCD;

#endif