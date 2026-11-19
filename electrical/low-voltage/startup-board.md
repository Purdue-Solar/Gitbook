# Startup Board

Author: Ben Sisk

1. Purpose
   1. The purpose of the startup board is to indicate whether the car should be turned on and which “mode” the car should be in. In addition, the startup board houses the e-stop, which disconnects power to the main contactors. Finally, the FNR (forward neutral reverse) switch must be able to indicate which direction (if any) the car should be driving.
2. Requirements
   1. The startup board must be able to function at a range of voltages; it is powered by the auxiliary battery, which has a wide operating range
   2. The startup board must be able to activate the relay on the power distribution board when not in “off” mode
   3. The startup board must be able to indicate the mode that the car should be in at the logic level of the distribution board.
   4. The startup board must be able to indicate the direction the car should be moving using the FNR switch.
3. Architecture
   1. The keyswitch only activates one of four pins. Currently, the startup board only offers off, regular, and charge mode.
   2. The input comes directly from the aux battery, so the charge mode indicator is stepped down from 12 volts to 5 volts. The “on” output is the inverted “off” mode on the keyswitch, and it is meant to power a relay, so it is 12 volts.
   3. The FNR switch is not powered by the startup board; instead, the microcontroller pulls up the forward and reverse pins. If a pin is grounded (and the other isn’t), it means that that pin has been selected. If neither has been selected, neutral is chosen.
4. Interfaces
   1. The startup board is effectively a user interface for the power distribution board, steering wheel, and contactors. Therefore, the startup board may need to change if any of these three components change.
   2. It is important to remember that these signals are not all related to each other and therefore the expectations for each one are different (voltage, active high vs active low).
5. Rationale
   1. The rationale for only one mode other than off/on is that the team was trying to get everything working as quickly as possible. The fourth mode does not offer a significant advantage, and would require an additional converter, or more likely a bunch of MOSFETs to be able to get a five volt line to drive a twelve volt signal. This would be necessary if the “on” output is still twelve volts but the keyswitch is reduced to five to save two converters.
6. Failure modes
   1. Below a certain aux battery voltage, the whole system will shut off, including the high voltage system
   2. The FNR switch has to go a long way to reach the steering wheel, which could possibly cause issues like a disconnected wire putting the system in neutral.
7. Testing procedures
   1. For the FNR switch, put a pullup resistor on each terminal. If the voltage on the pin of the FNR switch is zero, it is being selected.
   2. For the power distro signals, ensure that the keyswitch\_lv signal is twelve volts when the switch is not in “off” mode.
   3. The charge mode signal should be five volts and only active when the keyswitch is in charge mode
   4. Make sure to test a range of voltages, at least 9-15, or the operating range of the aux battery.
8. Bring-up procedures
   1. A stencil is preferred for this board
9. Lessons learned
   1. Add different operating modes for the car
   2. Make the startup board operate at 5 volts instead of 12 volts so that fewer components are required
   3. In the future, the startup board should be designed alongside the power distribution board so that the functionality is cleaner.
   4. Try to make everything through hole to simplify production, save the cost of stencils
   5. Put the resistors and capacitors on the sensing side, not on the keyswitch side to increase the effect of the RC circuit on the pins
