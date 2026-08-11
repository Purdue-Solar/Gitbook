# Motor Controller

Intended Author: Haasini Sabbella, Han Luu

1. Purpose
2. Requirements
3. Architecture
4. Interfaces
5. Rationale
6. Failure modes
7. Testing procedures
8. Bring-up procedures
9. Lessons learned

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
