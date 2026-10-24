---
description: Breakdown of Mitsuba M2096-III Motor
---

# Motor

For reference, actual system voltage (Min/Nom/Max)\[V]: **97.2/130.68/151.2**

**BMS limits system current pull to 33A -> can increase only if change fuse**

**MPPT will allows max current pull of 8A @** 130V (Max array input 7A @ 150V)

Basic Electrical Characteristic

* Vehicle weight: 265kg (with motor 3.2kg and an 80kg driver)
* Rated power: 2000W
* Max power: 5000W ⇒ @ 130V (battery nominal voltage) max current pull for motor: 5000/130 = 38.5A
* Rated load speed: 810rpm
* Rated voltage input: 96V
* Motor type: 3-phase, permanent magnet (BLDC), PWM output
* Refer to this datasheet for more info: [https://drive.google.com/drive/u/0/folders/1PC-zf67zuzDIVUikLINXf7b4GzFqlRKA](https://drive.google.com/drive/u/0/folders/1PC-zf67zuzDIVUikLINXf7b4GzFqlRKA)
* Power flow: Both battery discharge (from BMS) and solar (from MPPT) can contribute to motor consumption (at motor controller)

## Quick load calcs

Constraint:

* Battery nominal voltage: 130.68V
* Car total weight is 265kg
* Assumed duty cycle is

Goal:

* Desired speed is: 60mph
