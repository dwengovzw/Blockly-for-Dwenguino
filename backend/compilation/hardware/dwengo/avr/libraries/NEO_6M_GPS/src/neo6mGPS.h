#pragma once
#include "Arduino.h"




constexpr byte NEO_BUFF_LEN   = 10;
constexpr byte NEO_HEADER_LEN = 6;
constexpr byte NUM_FIELDS     = 20;
constexpr byte FIELD_LEN      = 10;
constexpr byte HEADER_LEN     = 6;




const byte NMEA_LEN = 16;
const byte FREQ_LEN = 14;
const byte BAUD_LEN = 28;

const byte GPGGA = 0;
const byte GPGLL = 1;
const byte GPGLV = 2;
const byte GPGSA = 3;
const byte GPRMC = 4;
const byte GPVTG = 5;

const byte NMEA_ID_POS  = 7;
const byte DDC_POS      = 8;
const byte SERIAL_1_POS = 9;
const byte SERIAL_2_POS = 10;
const byte USB_POS      = 11;
const byte SPI_POS      = 12;

const byte BAUD_0 = 14;
const byte BAUD_1 = 15;
const byte BAUD_2 = 16;
const byte BAUD_3 = 17;

const byte MEAS_RATE_1 = 6;
const byte MEAS_RATE_2 = 7;
const byte NAV_RATE_1  = 8;
const byte NAV_RATE_2  = 9;




const char CFG_MSG[NMEA_LEN] = {
	0xB5, // Header char 1
	0x62, // Header char 2
	0x06, // class
	0x01, // id
	0x08, // length LSB
	0x00, // length MSB
	0xF0, // payload (NMEA sentence ID char 1)
	0x00, // payload (NMEA sentence ID char 2)
	0x00, // payload I/O Target 0 - DDC           - (1 - enable sentence, 0 - disable)
	0x00, // payload I/O Target 1 - Serial Port 1 - (1 - enable sentence, 0 - disable)
	0x00, // payload I/O Target 2 - Serial Port 2 - (1 - enable sentence, 0 - disable)
	0x00, // payload I/O Target 3 - USB           - (1 - enable sentence, 0 - disable)
	0x00, // payload I/O Target 4 - SPI           - (1 - enable sentence, 0 - disable)
	0x00, // payload I/O Target 5 - Reserved      - (1 - enable sentence, 0 - disable)
	0x00, // CK_A
	0x00  // CK_B
};

const char CFG_RATE[FREQ_LEN] = {
	0xB5, // sync char 1
	0x62, // sync char 2
	0x06, // class
	0x08, // id
	0x06, // length LSB
	0x00, // length MSB
	0x64, // payload measRate (ms) 1
	0x00, // payload measRate (ms) 2
	0x00, // payload navRate (cycles) 1
	0x00, // payload navRate (cycles) 2
	0x01, // payload timeRef 1
	0x00, // payload timeRef 2
	0x00, // CK_A
	0x00  // CK_B
};

const char CFG_PRT[BAUD_LEN] = {
	0xB5, // sync char 1
	0x62, // sync char 2
	0x06, // class
	0x00, // id
	0x14, // length LSB
	0x00, // length MSB
	0x01, // payload portID
	0x00, // payload reserved0
	0x00, // payload txReady 1
	0x00, // payload txReady 2
	0xD0, // payload mode 1
	0x08, // payload mode 2
	0x00, // payload mode 3
	0x00, // payload mode 4
	0x00, // payload baudRate 0 (LSB)
	0x00, // payload baudRate 1
	0x00, // payload baudRate 2
	0x00, // payload baudRate 3 (MSB)
	0x07, // payload inProtoMask 1
	0x00, // payload inProtoMask 2
	0x03, // payload outProtoMask 1
	0x00, // payload outProtoMask 2
	0x00, // payload reserved4 1
	0x00, // payload reserved4 2
	0x00, // payload reserved5 1
	0x00, // payload reserved5 2
	0x00, // CK_A
	0x00  // CK_B
};

const char GPGGA_header[HEADER_LEN] = { '$', 'G', 'P', 'G', 'G', 'A' };
const char GPGLL_header[HEADER_LEN] = { '$', 'G', 'P', 'G', 'L', 'L' };
const char GPGLV_header[HEADER_LEN] = { '$', 'G', 'P', 'G', 'L', 'V' };
const char GPGSA_header[HEADER_LEN] = { '$', 'G', 'P', 'G', 'S', 'A' };
const char GPRMC_header[HEADER_LEN] = { '$', 'G', 'P', 'R', 'M', 'C' };
const char GPVTG_header[HEADER_LEN] = { '$', 'G', 'P', 'V', 'T', 'G' };




class neo6mGPS
{
public: // <<----------------------------------------------------------//public
	char data[NUM_FIELDS][FIELD_LEN];
	int utc_year    = 0;
	byte utc_month  = 0;
	byte utc_day    = 0;
	byte utc_hour   = 0;
	byte utc_min    = 0;
	float utc_sec   = 0;
	float lat_dm    = 0;
	float lon_dm    = 0;
	float lat_dd    = 0;
	float lon_dd    = 0;
	float sog_knots = 0;
	float cog_true  = 0;
	char navStatus  = 'V';
	char latDir     = ' ';
	char lonDir     = ' ';
	int fs          = 0;
	float nosv      = 0;
	float hdop      = 0;
	float msl       = 0;
	char umsl       = ' ';
	float altref    = 0;
	char usep       = ' ';
	float diffage   = 0;
	int diffstation = 0;




	void begin(HardwareSerial &port);
	void begin(usb_serial_class &port);
	void begin(HardwareSerial &port, uint32_t baud, uint16_t hertz);
	void begin(usb_serial_class &port, uint32_t baud, uint16_t hertz);

	void setupGPS(uint32_t baud, uint16_t hertz);
	void disableAllNmea();
	void enableAllNmea();
	void setSentence(char NMEA_num, bool enable);
	void changeBaud(uint32_t baud);
	void changeFreq(uint16_t hertz);
	bool available();




private: // <<---------------------------------------------------------//private
	HardwareSerial* _port;
	usb_serial_class* usb_port;
	bool usingUSB = false;
	
	bool startByteFound = false;
	byte fieldNum = 0;
	byte fieldIndex = 0;




	void enableSelectedNmea();
	bool parseData(char recChar);
	void calc_utc_time(float data);
	void calc_utc_date(int data);
	float dm_dd(float loc, char dir);
	void updateValues();
	bool findSentence(const char header[]);
	void insertChecksum(char packet[], const byte len);
	void sendPacket(char packet[], const byte len);
	void sendPacket(const char packet[], const byte len);
};
