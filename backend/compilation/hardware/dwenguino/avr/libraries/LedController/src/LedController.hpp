#pragma once

#include "LedController_low_level.hpp"
#include "LedController_template.hpp"
#include "LedController_movement.hpp"
#include "LedController_display.hpp"
#include "LedController_transformation.hpp"

template <size_t columns, size_t rows>
LedController<columns,rows>::~LedController() {
  initilized = false;
}

template <size_t columns, size_t rows>
LedController<columns,rows>::LedController(){};

template <size_t columns, size_t rows>
LedController<columns,rows>::LedController(unsigned int csPin) {
  init(csPin);
};

template <size_t columns, size_t rows>
LedController<columns,rows>::LedController(unsigned int dataPin, unsigned int clkPin,
                             unsigned int csPin, bool useHardwareSpiParam) {
  init(dataPin, clkPin, csPin, useHardwareSpiParam);
}

template <size_t columns, size_t rows>
LedController<columns,rows>::LedController(const controller_configuration<columns,rows> &config) {
  init(config);
};

template <size_t columns, size_t rows>
LedController<columns,rows>::LedController(const LedController &other) {
  if (!other.initilized) {
    return;
  }

  init(other.conf);

  for (unsigned int i = 0; i < conf.SegmentCount(); i++) {
    for (unsigned int j = 0; i < 8; i++) {
      LedStates[i][j] = other.LedStates[i][j];
    }
  }

  for (unsigned int j = 0; j < rows;j++){
    for (unsigned int i = 0; i < columns*2; i++) {
      spidata[j][i] = other.spidata[j][i];
    }
  }

  refreshSegments();
}

template <size_t columns, size_t rows>
void LedController<columns,rows>::init(unsigned int csPin) {
  controller_configuration<columns,rows> config;

  config.SPI_CS = csPin;
  config.useHardwareSpi = true;

  return init(config);
}

template <size_t columns, size_t rows>
void LedController<columns,rows>::init(unsigned int dataPin, unsigned int clkPin,
                         unsigned int csPin, bool useHardwareSpiParam) {
  if (initilized) {
    return;
  }

  controller_configuration<columns,rows> config;

  config.SPI_MOSI = dataPin;
  config.SPI_CLK = clkPin;
  config.SPI_CS = csPin;
  config.useHardwareSpi = useHardwareSpiParam;

  init(config);
}

template <size_t columns, size_t rows>
void LedController<columns,rows>::init(const controller_configuration<columns,rows> &configuration) {
  if (initilized) {
    return;
  }

  if (!configuration.isValid()) {
    return;
  }
  conf = configuration;

  initConf();
  initSPI();

  initilized = true;
  refreshSegments();
}

template <size_t columns, size_t rows>
void LedController<columns,rows>::initConf(){
  if (conf.useHardwareSpi) {
    conf.SPI_CLK = SCK;
    conf.SPI_MOSI = MOSI;
  }

  resetBuffers();
}

template <size_t columns, size_t rows>
void LedController<columns,rows>::initSPI(){
  pinMode(conf.SPI_MOSI, OUTPUT);
  pinMode(conf.SPI_CLK, OUTPUT);
 
  if(conf.virtual_multi_row){
    pinMode(conf.SPI_CS,OUTPUT);
    digitalWrite(conf.SPI_CS,LOW);
  }else{
    for(unsigned int i = 0; i < rows;i++){
      pinMode(conf.row_SPI_CS[i],OUTPUT);
      digitalWrite(conf.row_SPI_CS[i],LOW);
    }
  }

  if (conf.useHardwareSpi) {
    SPI.setBitOrder(MSBFIRST);
    SPI.setDataMode(SPI_MODE0);
    SPI.begin();
  }

  if(conf.virtual_multi_row){
    digitalWrite(conf.SPI_CS,HIGH);
  }else{
    for(unsigned int i = 0; i < rows;i++){
      digitalWrite(conf.row_SPI_CS[i],HIGH);
    }
  }
}

template <size_t columns, size_t rows>
bool LedController<columns,rows>::isInitilized() { return initilized; }

// to be remvoed for version 2.2.0
template <size_t columns, size_t rows>
void LedController<columns,rows>::getSegmentData(unsigned int column, unsigned int row_num, ByteBlock* resultLocation){
  getSegmentData(conf.getSegmentNumber(column,row_num),resultLocation);
}

// to be removed for version 2.2.0
template <size_t columns, size_t rows>
void LedController<columns,rows>::getSegmentData(unsigned int segmentindex,
                                   ByteBlock *resultLocation) {
  if (!initilized || segmentindex >= conf.SegmentCount() ||
      resultLocation == nullptr) {
    return;
  }

  for (unsigned int i = 0; i < 8; i++) {
    (*resultLocation)[i] = LedStates[segmentindex][i];
  }
}

template <size_t columns, size_t rows>
ByteBlock LedController<columns,rows>::getSegmentData(unsigned int segmentindex){
  if (!initilized || segmentindex >= conf.SegmentCount()){return ByteBlock();};
  return LedStates[segmentindex];
}

template <size_t columns, size_t rows>
ByteBlock LedController<columns,rows>::getSegmentData(unsigned int column, unsigned int row_num){
  return getSegmentData(conf.getSegmentNumber(column,row_num));
}

template <size_t columns, size_t rows>
unsigned int LedController<columns,rows>::getSegmentCount() {
  return columns*rows;
}

template <size_t columns, size_t rows>
const controller_configuration<columns,rows>& LedController<columns,rows>::getConfig() { return conf; }

