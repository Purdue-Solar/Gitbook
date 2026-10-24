# Power Distro Board

Intended Authors: Ben Sisk, Alex Lubbers, Issac

1. Purpose

The power distribution board has two purposes. The first purpose is to regulate and monitor power. It steps down the lithium ion battery voltage and utilizes an auxiliary battery to ensure that there is power available whenever possible. It checks that the power sources are safe and switches between the two sources when it makes sense to do so. It, along with the BMS, can disconnect the main battery and MPPTs from the car when the main battery is in unsafe condition or the low voltage power is out of spec. The second purpose is to distribute power throughout the car. Depending on the mode that the car is in, the board can change which parts are powered. The power distro board also powers the lights.

2. Requirements
   1. Only close the contactors (allow current) when the low voltage system is safe and the BMS indicates that the high voltage system is safe
      1. Whenever possible, the contactors should be closed to allow the car to be driven. Unexpected closing of the contactors during driving is risky, because it leads to sudden loss of motor power and therefore coasting.
      2. On startup, a precharge contactor should remain open, so that the current has to pass through a precharge resistor. This prevents current spikes and other transient behavior on startup. It should close after two seconds, if the car is in a safe state at that point.
      3. When the power distro board detects that the car is unsafe, it should open all of the contactors to prevent risking the main battery or any electronics.This means one of three things:
         1. A BMS CAN message suggests the high voltage system is unsafe, specifically that one of its main power contactors have been opened, or CAN communication has been lost
         2. One of the low voltage buses is too high in terms of current or voltage for the current mode of the car
         3. Due to a communications error, the power distribution board cannot determine whether the low voltage power is in a safe condition
   2. Power some components with the aux battery, but other components with prioritized power. This is done because some things can be powered by the aux battery according to regs, but others can’t always do so.
   3. Monitor the voltage and current on the aux and prioritized power lines to ensure that the low voltage system is always in safe condition.
   4. Power the light boards when requested to by the steering wheel (and the horn, optionally)
   5. Receive input from the startup board to determine the proper operating mode (currently unused functionality)
3. Architecture
4. Interfaces
5. PCB revisions
6. Firmware architecture
7. CAN messages
8. Known issues
9. Testing procedures
10. Bring-up procedures
11. Lessons learned

[https://docs.google.com/document/d/1HvBMEMmBNPfRMtV9A4pUbjS3ISioAUDTNsVYuk3VBYE/edit?usp=sharing](https://docs.google.com/document/d/1HvBMEMmBNPfRMtV9A4pUbjS3ISioAUDTNsVYuk3VBYE/edit?usp=sharing)\
[https://docs.google.com/document/d/1pQD50v-zp6xlOJk9XvyRPYVPXsNZhf2XROtc2u5jqlY/edit?usp=sharing](https://docs.google.com/document/d/1pQD50v-zp6xlOJk9XvyRPYVPXsNZhf2XROtc2u5jqlY/edit?usp=sharing)
