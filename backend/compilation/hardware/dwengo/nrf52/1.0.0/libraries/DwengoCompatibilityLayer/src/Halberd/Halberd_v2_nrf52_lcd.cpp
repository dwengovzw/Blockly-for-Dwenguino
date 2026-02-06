/* ---------------------------------------------------------------------------
	Dwenguino Compatibility Layer - v1.0.0
	
	Created on Feb 3 2026 by Tom Neutens from Dwengo vzw (www.dwengo.org)


* --------------------------------------------------------------------------- */

#include "shared/lcd.h"
#include <Arduino.h>


void BufferedLCD::clear() {
    Serial.println("LCD: clear()");
}

void BufferedLCD::backlightOn(void) {
    Serial.println("LCD: backlightOn()");
}

void BufferedLCD::backlightOff(void) {
    Serial.println("LCD: backlightOff()");
}

size_t BufferedLCD::write(uint8_t c) {
    Serial.print("LCD: write(0x");
    Serial.print(c, HEX);
    Serial.println(")");
    return 1;
}

void BufferedLCD::command(uint8_t cmd) {
    Serial.print("LCD: command(0x");
    Serial.print(cmd, HEX);
    Serial.println(")");
}

void BufferedLCD::init(uint8_t fourbitmode, uint8_t rs, uint8_t rw, uint8_t enable,
    uint8_t d0, uint8_t d1, uint8_t d2, uint8_t d3,
    uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7) {
    Serial.println("LCD: init()");
}

void BufferedLCD::begin(uint8_t cols, uint8_t rows, uint8_t charsize) {
    Serial.println("LCD: begin()");
}

void BufferedLCD::home() {
    Serial.println("LCD: home()");
}

void BufferedLCD::noDisplay() {
    Serial.println("LCD: noDisplay()");
}

void BufferedLCD::display() {
    Serial.println("LCD: display()");
}

void BufferedLCD::noBlink() {
    Serial.println("LCD: noBlink()");
}

void BufferedLCD::blink() {
    Serial.println("LCD: blink()");
}

void BufferedLCD::noCursor() {
    Serial.println("LCD: noCursor()");
}

void BufferedLCD::cursor() {
    Serial.println("LCD: cursor()");
}

void BufferedLCD::scrollDisplayLeft() {
    Serial.println("LCD: scrollDisplayLeft()");
}

void BufferedLCD::scrollDisplayRight() {
    Serial.println("LCD: scrollDisplayRight()");
}

void BufferedLCD::leftToRight() {
    Serial.println("LCD: leftToRight()");
}

void BufferedLCD::rightToLeft() {
    Serial.println("LCD: rightToLeft()");
}

void BufferedLCD::autoscroll() {
    Serial.println("LCD: autoscroll()");
}

void BufferedLCD::noAutoscroll() {
    Serial.println("LCD: noAutoscroll()");
}

void BufferedLCD::createChar(uint8_t location, uint8_t charmap[]) {
    Serial.println("LCD: createChar()");
}

void BufferedLCD::setCursor(uint8_t col, uint8_t row) {
    Serial.println("LCD: setCursor(" + String(col) + ", " + String(row) + ")");
}

size_t BufferedLCD::print(const __FlashStringHelper *ifsh) {
    Serial.println("LCD: print(FlashStringHelper)");
    return 0;
}

size_t BufferedLCD::print(const String &s) {
    Serial.println("LCD: print(" + s + ")");
    return 0;
}

size_t BufferedLCD::print(const char str[]) {
    Serial.println("LCD: print(" + String(str) + ")");
    return 0;
}

size_t BufferedLCD::print(char c) {
    Serial.println("LCD: print(" + String(c) + ")");
    return 0;
}

size_t BufferedLCD::print(unsigned char b, int base) {
    Serial.println("LCD: print(" + String(b) + ")");
    return 0;
}

size_t BufferedLCD::print(int n, int base) {
    Serial.println("LCD: print(" + String(n) + ")");
    return 0;
}

size_t BufferedLCD::print(unsigned int n, int base) {
    Serial.println("LCD: print(" + String(n) + ")");
    return 0;
}

size_t BufferedLCD::print(long n, int base) {
    Serial.println("LCD: print(" + String(n) + ")");
    return 0;
}

size_t BufferedLCD::print(unsigned long n, int base) {
    Serial.println("LCD: print(" + String(n) + ")");
    return 0;
}

size_t BufferedLCD::print(double n, int digits) {
    Serial.println("LCD: print(" + String(n, digits) + ")");
    return 0;
}

size_t BufferedLCD::print(const Printable &x) {
    Serial.println("LCD: print(Printable)");
    return 0;
}

size_t BufferedLCD::println(const __FlashStringHelper *ifsh) {
    Serial.println("LCD: println(FlashStringHelper)");
    return 0;
}

size_t BufferedLCD::println(const String &s) {
    Serial.println("LCD: println("  + s + ")");
    return 0;
}

size_t BufferedLCD::println(const char c[]) {
    Serial.println("LCD: println(" + String(c) + ")");
    return 0;
}

size_t BufferedLCD::println(char c) {
    Serial.println("LCD: println(" + String(c) + ")");
    return 0;
}

size_t BufferedLCD::println(unsigned char b, int base) {
    Serial.println("LCD: println(" + String(b) + ")");
    return 0;
}

size_t BufferedLCD::println(int num, int base) {
    Serial.println("LCD: println(" + String(num) + ")");
    return 0;
}

size_t BufferedLCD::println(unsigned int num, int base) {
    Serial.println("LCD: println(" + String(num) + ")");
    return 0;
}

size_t BufferedLCD::println(long num, int base) {
    Serial.println("LCD: println(" + String(num) + ")");
    return 0;
}

size_t BufferedLCD::println(unsigned long num, int base) {
    Serial.println("LCD: println(" + String(num) + ")");
    return 0;
}

size_t BufferedLCD::println(double num, int digits) {
    Serial.println("LCD: println(" + String(num, digits) + ")");
    return 0;
}

size_t BufferedLCD::println(const Printable &x) {
    Serial.println("LCD: println(Printable)");
    return 0;
}

size_t BufferedLCD::println(void) {
    Serial.println("LCD: println()");
    return 0;
}

// Global instance of BufferedLCD
BufferedLCD dwenguinoLCD;