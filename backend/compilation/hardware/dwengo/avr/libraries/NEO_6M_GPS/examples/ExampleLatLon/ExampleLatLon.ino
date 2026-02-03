#include "neo6mGPS.h"




neo6mGPS myGPS;




void setup()
{
  // turn on power led
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
  
  Serial.begin(115200);
  while(!Serial);
  
  myGPS.begin(Serial1);
}




void loop()
{
  if(myGPS.available())
  {
    Serial.print(myGPS.utc_year);  Serial.print(" | ");
    Serial.print(myGPS.utc_month); Serial.print(" | ");
    Serial.print(myGPS.utc_day);   Serial.print(" | ");
    Serial.print(myGPS.utc_hour);  Serial.print(" | ");
    Serial.print(myGPS.utc_min);   Serial.print(" | ");
    Serial.print(myGPS.utc_sec);   Serial.print(" | ");
    Serial.print(myGPS.lat_dd);    Serial.print(" | ");
    Serial.print(myGPS.lon_dd);    Serial.print(" | ");
    Serial.print(myGPS.sog_knots); Serial.print(" | ");
    Serial.print(myGPS.cog_true);  Serial.print(" | ");
    Serial.print(myGPS.navStatus);
    Serial.println();
  }
}


