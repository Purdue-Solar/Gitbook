---
description: Displays critical car information for driver
---

# Display

## Description

The display is mounted on the [steering wheel](./), and displays critical information for driver such as speed, motor current, etc.

## Usage

### Connections

The display is connected to the steering wheel through an [EYESPI](https://www.adafruit.com/product/5239) port on the back of the display for SPI communication.

{% hint style="warning" %}
To enable SPI on the display, the SPI jumpers on the back of the display must be soldered together. SPI will not work on the display if they are not soldered.
{% endhint %}

### Testing

## Hardware

* Display: [2.8" TFT LCD with Cap Touch Breakout Board w/MicroSD Socket - EYESPI Connector](https://www.adafruit.com/product/2090)

## Software

* CAN library: [canlib](../../libraries/can-library.md)
* Graphics library: [displaylib](../../libraries/displaylib.md)

## Project Requirements

### Displayed Information

* [ ] Speed
* [ ] Blind-spot indicator

#### Errors

* [ ] Main battery over current
* [ ] Main battery under current
* [ ] Main battery over voltage
* [ ] Main battery under voltage
* [ ] Aux battery over current
* [ ] Aux battery under current
* [ ] Aux battery over voltage
* [ ] Aux battery under voltage

#### Warnings

* [ ] Main battery over current
* [ ] Main battery under current
* [ ] Main battery over voltage
* [ ] Main battery under voltage
* [ ] Aux battery over current
* [ ] Aux battery under current
* [ ] Aux battery over voltage
* [ ] Aux battery under voltage

### Regulations

* [ ] [(American Solar Challenge Regulation 8.7.B)](https://www.americansolarchallenge.org/wp-content/uploads/2026/05/ASC2026-RegsC.pdf): The driver is to have an illuminated dash indicator for a BPS fault to provide warning of an automatic opening of the Main Power Contactors. This indicator must be labeled in text at least 5mm high and both the indicator and label must be within the driver’s direct line of sight when the driver is seated in their normal driving position.
