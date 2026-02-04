// Confitionally dispatch to the correct header file based on the board being compiled for. This allows the same code to work on both platforms without modification.
// Conditional includes for platform-specific features
#ifdef BOARD_HALBERD_V2
    #include "Halberd/Halberd_v2_nrf52_lcd.h"
#elif defined(BOARD_DWENGUINO_NRF52_V1)
    #include "Dwenguino_nrf52/Dwenguino_nrf52_lcd.h"
#else
    #error "No board specified. Define BOARD_HALBERD_V2 or BOARD_DWENGUINO_NRF52_V1 via build.extra_flags in boards.txt"
#endif




