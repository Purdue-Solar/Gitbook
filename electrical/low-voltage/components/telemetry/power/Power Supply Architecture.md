# Power Supply Architecture
## Background
**References**
1. [CDBW140-G Datasheet](electrical/low-voltage/components/telemetry/refs/CDBW140-G/CDBW140-G.pdf)
2. [TI Application Note](obsidian://open?vault=Gitbook&file=electrical%2Flow-voltage%2Fcomponents%2Ftelemetry%2Frefs%2FPowering%20electronics%20from%20the%20USB%20port.pdf)
3. [r/AskElectronics - Diodes Between Power Supplies](https://www.reddit.com/r/AskElectronics/comments/1qh5y0f/how_to_manage_power_between_power_supply_and_usbc/)
4. [Adafruit Sparkle Motion schematic](https://cdn-learn.adafruit.com/assets/assets/000/140/000/original/adafruit_products_schem_revD.png?1758828846)

**Why this exists**
The goal was to implement switching between USB & 5 V regulated power so that USB can be safely used while the telemetry board is connected to the car.
## System Overview
Device power comes from either +12 V supplied through the CAN connector, or +5 V supplied through an attached USB host. The ESP32 needs a 3.3 V supply, so these voltages must be stepped down.

+12 V is stepped down to +5 V. V_USB or the regulated +5 V is then stepped down to +3.3 V for the ESP32. The intermediate step from +12 V to +5 V was added so that the same circuitry powering the ESP32 through +5 V USB can be recycled to power the device from +12 V.

The LD1117 series of linear regulators are used in this design as they are free from the ECE shop. The LD1117V50C steps down +12 V to +5 V, and the LD1117V33C steps down +5 V to +3.3 V. [Status LEDs](wiki/power/LED%20Resistor%20Calculation.md) are placed on the device for information on each power rail.

## VUSB & 5 V LDO Supply Switching
<div align="center">
  <img src="refs/CDBW140-G-Fig3.png" alt="Forward current vs. forward voltage graph taken from datasheet." width="400">
</div>
A Schottky diode was used as it has a low forward voltage. The CDBW140-G Schottky diode was used as it is free in the ECE shop. 

A load of < 800 mA is expected on the 5 V rail, meaning the expected forward voltage ranges between 0.3~0.6 V. Assuming the LD1117V50 


## Power Supply Characteristics
