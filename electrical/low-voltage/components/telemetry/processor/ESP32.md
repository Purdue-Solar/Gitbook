# ESP32
```
Use the default **internal RC oscillator** when:

- Minimizing sleep current consumption is critical for battery-powered or energy-constrained devices.
    
- High time accuracy during sleep modes is not required. Time drifting in the range of several seconds per day is acceptable.
    
- Minimizing external components and hardware complexity is a priority.
    
- The operating temperature is relatively stable (reducing frequency variation).
    
- Bluetooth LE with power saving is not used, or only used for legacy advertising/scanning without connections.
    

Use an **external 32 kHz crystal** or **external 32 kHz oscillator** when:

- Accurate time-keeping during Deep-sleep and Light-sleep modes is required.
    
- A small increase in sleep current (typically a few μA) fits within the power budget.
    
- Adding external components is acceptable for the design.
    
- Operating temperature may vary significantly.
    
- Bluetooth LE with power saving is enabled and connections are required.
```
https://docs.espressif.com/projects/esp-idf/en/stable/esp32c6/api-reference/system/system_time.html#rtc-clock-source-choice

Therefore no external crystal was used

![](electrical/low-voltage/components/telemetry/refs/{D8C504FB-8B0C-4F77-80CC-43A2666A7C64}.png)
[esp32-c6-wroom-1_wroom-1u_datasheet_en.pdf](https://documentation.espressif.com/esp32-c6-wroom-1_wroom-1u_datasheet_en.pdf)