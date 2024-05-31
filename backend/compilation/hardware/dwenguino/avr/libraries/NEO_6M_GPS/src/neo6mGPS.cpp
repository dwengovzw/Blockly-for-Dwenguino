#include "neo6mGPS.h"




void neo6mGPS::begin(HardwareSerial &port)
{
	_port = &port;
	_port->begin(9600);

	setupGPS(115200, 10);
}




void neo6mGPS::begin(usb_serial_class &port)
{
	usingUSB = true;
	usb_port = &port;
	usb_port->begin(9600);

	setupGPS(115200, 10);
}




void neo6mGPS::begin(HardwareSerial &port, uint32_t baud, uint16_t hertz)
{
	_port = &port;
	_port->begin(9600);

	setupGPS(baud, hertz);
}




void neo6mGPS::begin(usb_serial_class &port, uint32_t baud, uint16_t hertz)
{
	usingUSB = true;
	usb_port = &port;
	usb_port->begin(9600);

	setupGPS(baud, hertz);
}




void neo6mGPS::setupGPS(uint32_t baud, uint16_t hertz)
{
	disableAllNmea();
	enableSelectedNmea();
	changeBaud(baud);
	changeFreq(hertz);
}




void neo6mGPS::disableAllNmea()
{
	setSentence(GPGGA, false);
	setSentence(GPGLL, false);
	setSentence(GPGLV, false);
	setSentence(GPGSA, false);
	setSentence(GPRMC, false);
	setSentence(GPVTG, false);
}




void neo6mGPS::enableAllNmea()
{
	setSentence(GPGGA, true);
	setSentence(GPGLL, true);
	setSentence(GPGSA, true);
	setSentence(GPGLV, true);
	setSentence(GPRMC, true);
	setSentence(GPVTG, true);
}




void neo6mGPS::enableSelectedNmea()
{
	//comment or uncomment based on what sentences desired

	//setSentence(GPGGA, true);
	//setSentence(GPGLL, true);
	//setSentence(GPGSA, true);
	//setSentence(GPGLV, true);
	setSentence(GPRMC, true);
	//setSentence(GPVTG, true);
}




void neo6mGPS::changeBaud(uint32_t baud)
{
	char configPacket[BAUD_LEN];
	memcpy(configPacket, CFG_PRT, BAUD_LEN);

	configPacket[BAUD_0] = (char)(baud & 0xFF);
	configPacket[BAUD_1] = (char)((baud >> 8) & 0xFF);
	configPacket[BAUD_2] = (char)((baud >> 16) & 0xFF);
	configPacket[BAUD_3] = (char)((baud >> 24) & 0xFF);

	insertChecksum(configPacket, BAUD_LEN);
	sendPacket(configPacket, BAUD_LEN);

	delay(100);

	if (usingUSB)
	{
		usb_port->flush();
		usb_port->begin(baud);
	}
	else
	{
		_port->flush();
		_port->begin(baud);
	}
}




void neo6mGPS::changeFreq(uint16_t hertz)
{
	uint16_t normHerz = hertz / (1000 / ((CFG_RATE[MEAS_RATE_2] << 8) | CFG_RATE[MEAS_RATE_1]));
	char configPacket[FREQ_LEN];
	memcpy(configPacket, CFG_RATE, FREQ_LEN);

	configPacket[NAV_RATE_1] = (char)(normHerz & 0xFF);
	configPacket[NAV_RATE_2] = (char)((normHerz >> 8) & 0xFF);

	insertChecksum(configPacket, FREQ_LEN);
	sendPacket(configPacket, FREQ_LEN);
}




bool neo6mGPS::available()
{
	char recChar;
	bool endProcessing;

	if (usingUSB)
	{
		while (usb_port->available())
		{
			recChar = usb_port->read();
			endProcessing = parseData(recChar);

			if (endProcessing)
				return true;
		}
	}
	else
	{
		while (_port->available())
		{
			recChar = _port->read();
			endProcessing = parseData(recChar);

			if (endProcessing)
				return true;
		}
	}

	return false;
}




bool neo6mGPS::parseData(char recChar)
{
	if (recChar == '\n')
	{
		startByteFound = false;
		fieldNum = 0;
		fieldIndex = 0;
		updateValues();
			
		return true;
	}
	else if (((recChar == ',') && startByteFound) || ((recChar == '*') && startByteFound))
	{
		fieldNum++;
		fieldIndex = 0;
	}
	else if (!startByteFound)
	{
		if (recChar == '$')
		{
			startByteFound = true;
			data[fieldNum][fieldIndex] = recChar;
			fieldIndex++;
		}
	}
	else
	{
		if ((fieldNum < NUM_FIELDS) && (fieldIndex < FIELD_LEN))
		{
			data[fieldNum][fieldIndex] = recChar;
			fieldIndex++;
		}
	}

	return false;
}




// hhmmss.sss
void neo6mGPS::calc_utc_time(float time)
{
	utc_hour = (int)(time / 10000);
	utc_min = (int)((time - (utc_hour * 10000)) / 100);
	utc_sec = time - (utc_hour * 10000) - (utc_min * 100);
}




// ddmmyy
void neo6mGPS::calc_utc_date(int date)
{
	utc_day = date / 10000;
	utc_month = (date - (utc_day * 10000)) / 100;
	utc_year = 2000 + date - (utc_day * 10000) - (utc_month * 100);
}




// (d)ddmm.mmmm, D
float neo6mGPS::dm_dd(float loc, char dir)
{
	float result = (int)(loc / 100);

	result += (loc - (result * 100)) / 60.0;

	if (dir == 'S' || dir == 'W')
		result = -result;

	return result;
}




void neo6mGPS::updateValues()
{
	if (findSentence(GPGGA_header))
	{
		calc_utc_time(atof(data[1]));

		lat_dm  = atof(data[2]);
		latDir  = data[3][0];
		lat_dd  = dm_dd(lat_dm, latDir);
		lon_dm  = atof(data[4]);
		lonDir  = data[5][0];
		lon_dd  = dm_dd(lon_dm, lonDir);
		fs      = atoi(data[6]);
		nosv    = atof(data[7]);
		hdop    = atof(data[8]);
		msl     = atof(data[9]);
		umsl    = data[10][0];
		altref  = atof(data[11]);
		usep    = data[12][0];
		diffage = atof(data[13]);
		diffstation = atoi(data[14]);
	}
	else if (findSentence(GPGLL_header))
	{
		lat_dm     = atof(data[1]);
		latDir    = data[2][0];
		lat_dd    = dm_dd(lat_dm, latDir);
		lon_dm    = atof(data[3]);
		lonDir    = data[4][0];
		lon_dd    = dm_dd(lon_dm, lonDir);

		calc_utc_time(atof(data[5]));

		navStatus = data[6][0];
	}
	else if (findSentence(GPGLV_header))
	{
		// TODO
	}
	else if (findSentence(GPGSA_header))
	{
		// TODO
	}
	else if (findSentence(GPRMC_header))
	{
		calc_utc_time(atof(data[1]));

		navStatus = data[2][0];
		lat_dm    = atof(data[3]);
		latDir    = data[4][0];
		lat_dd    = dm_dd(lat_dm, latDir);
		lon_dm    = atof(data[5]);
		lonDir    = data[6][0];
		lon_dd    = dm_dd(lon_dm, lonDir);
		sog_knots = atof(data[7]);
		cog_true  = atof(data[8]);

		calc_utc_date(atoi(data[9]));
	}
	else if (findSentence(GPVTG_header))
	{
		// TODO
	}
}




bool neo6mGPS::findSentence(const char header[])
{
	for (byte i = 0; i < HEADER_LEN; i++)
		if (data[0][i] != header[i])
			return false;

	return true;
}




void neo6mGPS::setSentence(char NMEA_num, bool enable)
{
	char configPacket[NMEA_LEN];
	memcpy(configPacket, CFG_MSG, NMEA_LEN);

	if (enable)
		configPacket[SERIAL_1_POS] = 1;

	configPacket[NMEA_ID_POS] = NMEA_num;
	insertChecksum(configPacket, NMEA_LEN);

	sendPacket(configPacket, NMEA_LEN);
}




void neo6mGPS::insertChecksum(char packet[], const byte len)
{
	uint8_t ck_a = 0;
	uint8_t ck_b = 0;

	// exclude the first and last two bytes in packet
	for (byte i = 2; i < (len - 2); i++)
	{
		ck_a += packet[i];
		ck_b += ck_a;
	}

	packet[len - 2] = ck_a;
	packet[len - 1] = ck_b;
}




void neo6mGPS::sendPacket(char packet[], const byte len)
{
	if (usingUSB)
		usb_port->write(packet, len);
	else
		_port->write(packet, len);
}




void neo6mGPS::sendPacket(const char packet[], const byte len)
{
	if (usingUSB)
		usb_port->write(packet, len);
	else
		_port->write(packet, len);
}
