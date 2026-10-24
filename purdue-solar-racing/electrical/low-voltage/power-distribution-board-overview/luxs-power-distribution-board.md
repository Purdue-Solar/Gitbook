---
description: >-
  Describes the functionality of the components on the PSR power distribution
  board.
---

# Lux's Power Distribution Board

## Major Components

### [CN200B110-13.8](https://product.tdk.com/en/search/power/switching-power/dc-dc-converter/info?part_no=CN200B110-13.8)

* The CN200B110-13.8 is a buck converter that takes an input voltage, ranging from 43-160 Vdc, and outputs a voltage lower than the input, at 13.8 Vdc at 14.5A.&#x20;
* This pa
* rt was sponsored, so PSR did not spend any money to acquire it.

### [LMC4417](https://www.analog.com/media/en/technical-documentation/data-sheets/ltc4417.pdf)

* _From the datasheet:_ The LTC®4417 connects one of three valid power supplies to a common output based on priority. Priority is defined by pin assignment, with V1 assigned the highest priority and V3 the lowest priority. A power supply is defined as valid when its voltage has been within its overvoltage (OV) and undervoltage (UV) window continuously for at least 256ms. If the highest priority valid input falls out of the OV/UV window, the channel is immediately disconnected and the next highest priority valid input is connected to the common output. Two or more LTC4417s can be cascaded to provide switchover between more than three inputs.
* Our setup for the LTC 4417 has our first input for the chip as the DC-DC converter's and the second input as the aux battery.&#x20;
* When the car is initially turned on, the aux battery supplies voltage to the outputs that are required to be turned on at start up. Once the BMS is done checking the battery, it then sends the voltage (approximately 120V, nominal) to the DC-DC converter which then send the converted voltage to the LMC4417.
* When the LMC4417 detects voltages from both the aux battery and the car's battery, it switches to the highest priority, the car battery, which then supplies voltages to the outputs connected to it.&#x20;
* The LTC4417 requires a little bit of math to determine what to set the resistors in the voltage dividers for OV and UV, which was done by [Aidan Orr](https://app.gitbook.com/u/AOToT4K36uerFKUGr05ns6L9Bs63 "mention") on [Desmos](https://www.analog.com/media/en/technical-documentation/data-sheets/ltc4417.pdf).

### [INA228](https://www.ti.com/lit/ds/symlink/ina228.pdf?ts=1692005796995)

* _From the datasheet:_ The INA228 is an ultra-precise digital power monitor with a 20-bit delta-sigma ADC specifically designed for current-sensing applications. The device can measure a full-scale differential input of ±163.84 mV or ±40.96 mV across a resistive shunt sense element with common-mode voltage support from –0.3 V to +85 V. The INA228 reports current, bus voltage, temperature, power, energy and charge accumulation while employing a precision ±0.5% integrated oscillator, all while performing the needed calculations in the background. The integrated temperature sensor is ±1°C accurate for die temperature measurement and is useful in monitoring the system ambient temperature.
* The board has two INA228 chips on it. One has a shunt resistor that connects between Aux battery's input and ouput and another that connects between the input from the car's battery and the output of the DC-DC converter.&#x20;

### Outputs

* There are 20 outputs that are dependent on the output from the LTC4417 and 10 outputs are connected directly to the aux battery, which bypasses the LTC4417.
* Each output has a connector, a status LED, and a fuse.&#x20;
