# Backend Compilation System

This directory contains the Arduino/embedded systems compilation infrastructure for the Dwenguino IDE. It manages the compilation of Blockly-generated code to binaries for different microcontroller boards.

## Overview

The compilation system supports multiple hardware platforms:
- **Dwenguino v1** - AVR-based board (AT90USB646)
- **Halberd** - nrf52840-based robotic gripper control board
- **Dwenguino v2** - Future nrf52840-based successor to Dwenguino v1

The system is designed to handle board-agnostic code generation through a unified Hardware Abstraction Layer (HAL), allowing legacy programs to run on new hardware without modification.

## Directory Structure

```
backend/compilation/
├── README.md                          # This file
├── Makefile                          # Build configuration for AVR (Dwenguino v1)
├── Arduino.mk                        # Arduino build system rules
├── Common.mk                         # Shared build rules
├── bin/                              # Compiled binaries and build outputs
├── hardware/                         # Board definitions and libraries
│   ├── arduino/                      # Official Arduino board definitions (reference)
│   ├── dwenguino/                    # Dwenguino v1 (AVR) board package
│   │   └── avr/
│   │       ├── bootloaders/          # Custom bootloader for Dwenguino
│   │       ├── cores/                # Arduino core implementation
│   │       ├── libraries/            # Board-specific libraries
│   │       │   ├── Dwenguino/        # Main Dwenguino hardware library
│   │       │   ├── Wire/             # I2C communication
│   │       │   ├── LiquidCrystal/    # LCD display support
│   │       │   ├── Servo/            # Servo motor control
│   │       │   ├── DwenguinoMotor/   # DC motor control
│   │       │   └── DwenguinoHAL/     # ⭐ Unified Hardware Abstraction Layer
│   │       └── variants/             # Dwenguino pin definitions
│   ├── dwengo/                       # Dwengo boards (Halberd, future Dwenguino v2)
│   │   └── nrf52/1.0.0/
│   │       ├── bootloaders/          # UF2 bootloader for nrf52840
│   │       ├── cores/                # nrf52 Arduino core
│   │       ├── libraries/            # nrf52-specific libraries
│   │       │   ├── Wire/             # I2C for nrf52
│   │       │   ├── SPI/              # SPI for nrf52
│   │       │   ├── Bluefruit52Lib/   # Bluetooth support
│   │       │   ├── DwenguinoHAL/     # ⭐ Unified Hardware Abstraction Layer
│   │       │   └── [other libs]/
│   │       └── variants/             # Board-specific pin mappings
│   ├── tools/                        # Compilation tools (gcc, avrdude, etc.)
│   └── README.md                     # Hardware documentation
├── lib/                              # Additional shared libraries
├── libraries/                        # Shared libraries (Arduino format)
└── preferences.txt                   # Arduino IDE preferences
```

## Hardware Abstraction Layer (HAL)

### Purpose

The Hardware Abstraction Layer provides a **unified API** that works across all supported boards. This allows:
- Single set of Blockly blocks for all boards
- Legacy programs to run on new hardware
- Easy addition of new boards without modifying Blockly generators

### Structure

The HAL is implemented in two locations:

#### AVR Implementation (Dwenguino v1)
```
hardware/dwenguino/avr/libraries/DwenguinoHAL/
├── library.properties
└── src/
    ├── DwenguinoHAL.h              # Unified API header
    └── DwenguinoHAL.cpp            # Wrapper around Dwenguino.h
```

#### nrf52 Implementation (Halberd & Dwenguino v2)
```
hardware/dwengo/nrf52/1.0.0/libraries/DwenguinoHAL/
├── library.properties
└── src/
    ├── DwenguinoHAL.h              # Same unified API header
    └── DwenguinoHAL_nrf52.cpp      # nrf52-specific implementation
```

### Unified API Example

All HAL implementations expose the same interface:

```cpp
// DwenguinoHAL.h - Same for all boards
void HAL_init();
void HAL_delay(uint32_t ms);
void HAL_setLEDs(uint8_t mask);
void HAL_lcdClear();
void HAL_lcdPrint(const char* text);
void HAL_lcdSetCursor(uint8_t col, uint8_t row);
uint8_t HAL_readButton(uint8_t buttonNum);
void HAL_setServo(uint8_t servoNum, uint8_t angle);
// ... more functions
```

### Implementation Details

**AVR (Dwenguino v1):**
```cpp
// DwenguinoHAL.cpp - Wrapper around existing Dwenguino library
#include "DwenguinoHAL.h"
#include <Dwenguino.h>

void HAL_init() {
    initDwenguino();  // Calls existing Dwenguino initialization
}

void HAL_setLEDs(uint8_t mask) {
    LEDS = mask;      // Direct register write (Dwenguino v1 specific)
}
```

**nrf52 (Halberd):**
```cpp
// DwenguinoHAL_nrf52.cpp - nrf52-specific implementation
#include "DwenguinoHAL.h"

void HAL_init() {
    // Initialize nrf52840 GPIO, peripherals, etc.
}

void HAL_setLEDs(uint8_t mask) {
    // Map Dwenguino LED bit positions to nrf52 GPIO pins
    // Different pin layout, same logical interface
}
```

## Compilation Process

### 1. Frontend: Code Generation (Blockly → Arduino C++)

**User Flow:**
1. User creates program in Blockly editor
2. Selects target board (Dwenguino or Halberd)
3. Clicks "Run" or "Download"

**Blockly Generator Output:**
```cpp
#include <DwenguinoHAL.h>    // ← Same include for all boards

void setup() {
    HAL_init();              // ← Same API for all boards
    HAL_setLEDs(0xFF);
}

void loop() {
    HAL_delay(1000);
}
```

**Generator Location:** `blockly/generators/arduino/dwenguino.js`

### 2. Backend: HTTP Request

The frontend sends compiled code to the backend:

```
POST /utilities/getDwenguinoBinary  (for Dwenguino)
POST /utilities/getHalberdBinary    (for Halberd)

Payload: { code: "...", ... }
```

### 3. Backend: Compilation

The backend compiles the generated code using the appropriate board configuration.

**Dwenguino v1 (AVR):**
```bash
make BOARD_TAG=dwenguino USER_LIB_PATH=hardware/dwenguino/avr/libraries
```

The compiler:
- Locates `hardware/dwenguino/avr/libraries/DwenguinoHAL/`
- Links `DwenguinoHAL.cpp` (AVR implementation)
- Produces `.dw` binary file

**Halberd (nrf52):**
```bash
platformio run -e halberd
# or equivalent for nrf52 compilation
```

The compiler:
- Locates `hardware/dwengo/nrf52/1.0.0/libraries/DwenguinoHAL/`
- Links `DwenguinoHAL_nrf52.cpp` (nrf52 implementation)
- Produces `.uf2` binary file

### 4. Frontend: Download

Browser downloads the compiled binary file.

## Compilation Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│               Blockly Frontend (Browser)                     │
│                                                              │
│  User selects: Board = "Halberd"                            │
│  Blockly generates: #include <DwenguinoHAL.h>              │
│                     HAL_init(), HAL_setLEDs(), etc.         │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ POST /utilities/getHalberdBinary
                         │ { code: "..." }
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Compilation Engine                      │
│                                                              │
│  1. Receive code with HAL includes                         │
│  2. Route to correct board compiler                        │
│     → Halberd → nrf52 compiler                             │
│  3. Compiler searches: hardware/dwengo/nrf52/libraries/    │
│  4. Finds DwenguinoHAL → links DwenguinoHAL_nrf52.cpp     │
│  5. Compile to nrf52 binary                                │
│  6. Convert to UF2 format (.uf2)                           │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Download compiled_program.uf2
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          User Downloads Binary & Programs Board             │
│                                                              │
│  Halberd runs HAL_init() → nrf52 hardware initialized      │
│  Same program on Dwenguino would run:                      │
│    HAL_init() → AVR hardware initialized                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Library Discovery & Linking

### How Arduino/PlatformIO Finds Libraries

When the compiler encounters `#include <DwenguinoHAL.h>`:

**For Dwenguino (AVR):**
1. Compiler searches: `hardware/dwenguino/avr/libraries/DwenguinoHAL/src/`
2. Finds `DwenguinoHAL.h` and `DwenguinoHAL.cpp`
3. Links `DwenguinoHAL.cpp` (AVR implementation)

**For Halberd (nrf52):**
1. Compiler searches: `hardware/dwengo/nrf52/1.0.0/libraries/DwenguinoHAL/src/`
2. Finds `DwenguinoHAL.h` and `DwenguinoHAL_nrf52.cpp`
3. Links `DwenguinoHAL_nrf52.cpp` (nrf52 implementation)

### library.properties

Each HAL implementation has a `library.properties` file:

**Dwenguino v1:**
```properties
name=DwenguinoHAL
version=2.0.0
author=Dwengo
architectures=avr
category=Device Control
```

**Halberd:**
```properties
name=DwenguinoHAL
version=2.0.0
author=Dwengo
architectures=nrf52
category=Device Control
```

The `architectures` field ensures the correct implementation is used during compilation.

## Integration Points

### 1. Blockly Code Generators
**File:** `blockly/generators/arduino/dwenguino.js`

**Current Code:**
```javascript
Blockly.Arduino['setup_loop_structure'] = function (block) {
    Blockly.Arduino.definitions_['define_dwenguino_h'] = '#include <Dwenguino.h>\n';
    Blockly.Arduino.definitions_['define_lcd_h'] = '#include <LiquidCrystal.h>\n';
    Blockly.Arduino.setups_['initDwenguino'] = 'initDwenguino();\n';
    // ...
}
```

**Updated Code (with HAL):**
```javascript
Blockly.Arduino['setup_loop_structure'] = function (block) {
    Blockly.Arduino.definitions_['define_hal_h'] = '#include <DwenguinoHAL.h>\n';
    Blockly.Arduino.setups_['initHAL'] = 'HAL_init();\n';
    // ...
}
```

### 2. Backend Routes
**File:** `backend/routes/compilation.ts` (or equivalent)

Routes request to appropriate compilation function based on board selection.

### 3. Compilation Commands

**For each board type, the compilation system needs to know:**
- Which hardware directory to use
- Which compilation tool to invoke
- Expected output format (`.dw`, `.uf2`, etc.)

Example mapping:
```javascript
{
  "dwenguino": {
    hardware_dir: "hardware/dwenguino/avr",
    compiler: "make",
    output_ext: ".dw"
  },
  "halberd": {
    hardware_dir: "hardware/dwengo/nrf52/1.0.0",
    compiler: "platformio",
    output_ext: ".uf2"
  }
}
```

## Adding New Boards

### To add a new board (e.g., Dwenguino v2 on nrf52):

1. **Create HAL implementation**
   ```
   hardware/dwengo/nrf52/1.0.0/libraries/DwenguinoHAL/
   └── src/
       ├── DwenguinoHAL.h             (same as others)
       └── DwenguinoHAL_nrf52_v2.cpp  (specific to v2 variants)
   ```

2. **Update board configuration**
   ```
   hardware/dwengo/nrf52/1.0.0/variants/
   └── dwenguino_v2/pins_arduino.h    (pin mappings)
   ```

3. **Register board in frontend**
   ```javascript
   // DwenguinoBlockly.boards
   "dwenguino_v2": { value: "dwenguino_v2", label: "Dwenguino v2" }
   ```

4. **Add compilation route**
   ```javascript
   // DwenguinoBlockly.compilationRoutes
   dwenguino_v2: "/utilities/getDwenguinoV2Binary"
   ```

5. **Backend handles compilation** (no code changes needed if using same HAL API)

## Maintenance & Testing

### HAL API Changes

When modifying the HAL API:

1. **Update header** (`DwenguinoHAL.h`)
2. **Update all implementations:**
   - `hardware/dwenguino/avr/libraries/DwenguinoHAL/src/DwenguinoHAL.cpp`
   - `hardware/dwengo/nrf52/1.0.0/libraries/DwenguinoHAL/src/DwenguinoHAL_nrf52.cpp`
3. **Update Blockly generators** to use new API
4. **Test on all boards** before deploying

### Compilation Testing

Test that the same program compiles correctly for all boards:

```bash
# Test program with HAL
cat > test_hal.ino << 'EOF'
#include <DwenguinoHAL.h>

void setup() {
  HAL_init();
  HAL_setLEDs(0xFF);
}

void loop() {
  HAL_delay(1000);
  HAL_setLEDs(0x00);
  HAL_delay(1000);
  HAL_setLEDs(0xFF);
}
EOF

# Compile for Dwenguino v1
make BOARD_TAG=dwenguino

# Compile for Halberd
platformio run -e halberd
```

## Known Issues & Limitations

### Feature Parity

Not all features are available on all boards:

| Feature | Dwenguino v1 | Halberd | Notes |
|---------|---|---|---|
| Dual LED Register | ✓ | ✗ | Halberd uses GPIO pins instead |
| LCD Display | ✓ | ✗ | Falls back to Serial output on nrf52 |
| Servo Motors | ✓ | ✓ | Both support via different mechanisms |
| I2C | ✓ | ✓ | Same API, different peripherals |
| Bluetooth | ✗ | ✓ | nrf52 has native BLE support |

### Workarounds

For features not available on all boards, provide fallbacks in HAL:

```cpp
// DwenguinoHAL.cpp (AVR)
void HAL_lcdPrint(const char* text) {
    dwenguinoLCD.print(text);
}

// DwenguinoHAL_nrf52.cpp
void HAL_lcdPrint(const char* text) {
    Serial.println(text);  // Fallback to serial on boards without LCD
}
```

## References

- [Arduino Build System](https://github.com/sudar/Arduino-Makefile)
- [PlatformIO Documentation](https://docs.platformio.org/)
- [Arduino Library Format](https://arduino.github.io/arduino-cli/library-specification/)
- [nrf52840 Arduino Core](https://github.com/adafruit/nrfx)
- [Dwenguino Hardware](http://www.dwengo.org/)
