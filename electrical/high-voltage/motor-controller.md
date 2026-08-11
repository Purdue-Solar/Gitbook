---
description: Break down of WaveSculpture22
---

# Motor Controller

Intended Author: Han Luu

We use the WaveSculptor 22 motor controller (Prohelion). Here is the website which explains many of the details: [Wavescultptor datasheet](https://docs.prohelion.com/Motor_Controllers/WaveSculptor22/Datasheet/index.html)

Some implementation details on our car:

* We use only one motor controller
* Since our high voltage system is incompatible with regenerative braking as of 2026, we are unable to do cruise control mode. Cruise control mode implies the ability of the motor to slow down the car with regen braking. This means we only use torque control mode, which involves setting an unrealistic RPM and controlling the current going to the motor.
* We have set up CAN so that the motor controller is sending messages from base CAN address 0x400 and receiving messages from CAN address 0x500.&#x20;
* The steering wheel should account for the following messages:
* Power distro -> Steering wheel
* Serial number + prohelion ID (cannot be disabled, 0x400, 1000 ms)
* All error flags (0x401, 200ms)
* Bus voltage and current (0x402, 200ms)
* Velocity measurement (0x403, 200ms)
* Heat-sink & Motor Temperature Measurement (0x40B, 1000 ms)
* Steering wheel -> Power distro
* Motor drive Command (upper 32 bits motor current, lower 32 bits motor velocity. Current is expressed as a percentage between zero and one, while the velocity is in rpm (signed). The rpm should be +/- an unobtainable number, while the current should be adjusted by the accelerator pedal.

For reference, actual system voltage (Min/Nom/Max)\[V]: **97.2/130.68/151.2**

System CAN Baudrate: 500kps

## Basic Electrical Characteristic

* Capacity: 20kVA
* Max continuous battery voltage: 160V
* Max motor current (load): 100Arms
* Compatible motor type: 3-phase, permanent magnet (BLDC) or induction
* CAN base address 0x400
* Refer to wavesculpture website for more info: [https://docs.prohelion.com/Motor\_Controllers/index.html](https://docs.prohelion.com/Motor_Controllers/index.html)

## Installation method

Refer to this youtube video: [https://www.youtube.com/watch?v=-kUz5k7w2fo](https://www.youtube.com/watch?v=-kUz5k7w2fo)

For more detailed wiring for bench testing, refer to this drive folder: [https://drive.google.com/drive/folders/1f\_LGkH-cgUHnuGOpEogwlZrafgsVDeQX?usp=drive\_link](https://drive.google.com/drive/folders/1f_LGkH-cgUHnuGOpEogwlZrafgsVDeQX?usp=drive_link)

Basic equipment for bench testing:

* CAN-serial adapter (small, exposed pcb)
* Serial-ethernet adapter (branded tritium or something else)
* 2 12VDC aux battery packs connected in series (act in place of the main battery pack)
* 1 12VDC power source (recommend using a power supply instead to battery pack as current limiting can be enabled)
* 1 motor and 4 wires from that motor (3 phase wires and 1 hall sensor wire

We use the WaveSculptor 22 motor controller (Prohelion). Here is the website which explains many of the details: [Wavescultptor datasheet](https://docs.prohelion.com/Motor_Controllers/WaveSculptor22/Datasheet/index.html)

## Implementation details

* We use only one motor controller
* Since our high voltage system is incompatible with regenerative braking as of 2026, we are unable to do cruise control mode. Cruise control mode implies the ability of the motor to slow down the car with regen braking. This means we only use torque control mode, which involves setting an unrealistic RPM and controlling the current going to the motor.
* We have set up CAN so that the motor controller is sending messages from base CAN address 0x400 and receiving messages from CAN address 0x500.
* The steering wheel should account for the following messages:
  * Power distro -> Steering wheel
    * Serial number + prohelion ID (cannot be disabled, 0x400, 1000 ms)
    * All error flags (0x401, 200ms)
    * Bus voltage and current (0x402, 200ms)
    * Velocity measurement (0x403, 200ms)
    * Heat-sink & Motor Temperature Measurement (0x40B, 1000 ms)
  * Steering wheel -> Power distro
    * Motor drive Command (upper 32 bits motor current, lower 32 bits motor velocity. Current is expressed as a percentage between zero and one, while the velocity is in rpm (signed). The rpm should be +/- an unobtainable number, while the current should be adjusted by the accelerator pedal.





