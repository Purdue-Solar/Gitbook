# Steering Wheel

Intended Authors: Ben Sisk

* More formal requirements (not mixed with architecture)
* Rationale section
* Tie testing to requirements

1. Purpose

The steering wheel is effectively just a CAN controller with inputs and outputs; its purpose is for the user to be able to visually see the state of the car using what is on CAN (display is in a separate section) and be able to send CAN messages which affect the operation of the car. Buttons, FNR (forward neutral reverse switch), acceleration, and brake pedals collectively control the operation of the motor controller and the lights. The PTT (push to talk button) allows the driver to talk over the radio.

2. Requirements
   1. Send CAN messages to control the operation of the motor
      1. The steering wheel should command vehicle torque
      2. The steering wheel should request a speed of zero when there is a critical component that identifies a relevant error (power distro board, BMS, motor controller)
      3. The three critical values are motor current, motor velocity, and bus current. Motor velocity must be set to an unrealistically high absolute value for torque control mode, except in neutral, when it should be zero.
      4. The bus current must be set to the maximum current that the motor controller can take out of the battery, and the motor current should be configured to its desired value.
      5. The FNR switch must determine which direction the car goes. The car should not move in neutral, and should move backwards slowly in reverse.
      6. The acceleration pedal must determine the speed that the car goes at. For this vehicle, current represents the velocity of the car, but if regen braking and cruise control were possible, RPM would also be a suitable option.
      7. The power hold, power hold up, and power hold down buttons should enable a minimum current when moving forwards. The power hold button enables the mode, while the power hold up and power hold down buttons should allow the current setpoint to change.
      8. These CAN messages must be sent every 100ms, or what is defined in the CAN definition
   2. Send CAN messages to control the operation of the lights
      1. The brake pedal must activate the corresponding CAN message for the brake pedal lights, level sensitive.
      2. The hazard lights, left lights, and right lights must activate the corresponding CAN messages. They are level sensitive but edge sensitive downstream (power distro board detects edges).
      3. This CAN message must be sent every 100ms, or what is defined in the CAN definition
   3. Receive CAN messages for the purpose of displaying data
      1. The steering wheel must be able to receive a variety of CAN messages and be easily reconfigurable to change what is received. This includes the power distribution board and BMS for safety related messages and the motor controller and BMS for performance related messages.
      2. The steering wheel must be able to verify that the necessary CAN messages are being received often enough as defined in the can definition, otherwise, it must indicate that the data is stale
   4. The steering wheel must be able to enable and disable talking over a radio
   5. The steering wheel must be able to house a display (see display for more details)
3. Architecture
   1. The board is centered around a waveshare rp2350 can board. It receives input from the FNR switch (active low, pulled up internally), the accelerator pedal, the brake pedal, and the rows of a 3x3 button matrix.
   2. CAN and 12v power (technically 13.8 nominal) comes from the two RJ45 connectors. The power is stepped down to 5 volts using a buck converter, and the rp2350 takes the five volt line down to 3.3 volts for the display.
   3. The rp2350 drives the rows of the button matrix one by one and then reads the voltage output at the columns (active high). This is done with an alarm based architecture so the buttons can operate entirely in the background.
   4. The code for the display functions on a separate core than the steering wheel code, but owns many GPIO pins which control the display.
   5. The main code loop first checks the state of the buttons. Then, it sends CAN messages if a message hasn’t been sent for at least 100ms, receives CAN messages and puts them into a shared structure with the display code, and checks if the CAN messages it expects to receive have arrived soon enough. Finally, the code updates the state of the accelerator, FNR switch, and the power hold accordingly.
4. Rationale
5. Interfaces
   1. The steering wheel has to send what the power distribution board expects according to the CAN specification, and that includes ensuring that the power distribution board detects edge transitions for some inputs, specifically the non-brake lights. The steering wheel receives CAN messages from the power distro board regarding warnings and errors for under/over voltage/current on the main/aux power lines. The steering wheel also receives main/aux power line valid signals, main/aux i2c valid signals, and a precharge active signal.
   2. The steering wheel has to send CAN data to the motor controller indicating motor current, motor velocity, and bus current, as specified here: [https://docs.prohelion.com/Motor\_Controllers/WaveSculptor22/User\_Manual/Appendix\_C.html#motor-power-command](https://docs.prohelion.com/Motor_Controllers/WaveSculptor22/User_Manual/Appendix_C.html#motor-power-command). This resource also has an extensive list of what the motor controller can send to the steering wheel. Most critical are the limit and error flags, vehicle velocity, heat sink temperature, and bus current. Note that the messages which are sent from the wavesculptor can be enabled and disabled. The starting position of the motor controller CAN messages can be determined, but otherwise the
   3. The steering wheel must receive CAN data from the BMS to display status information related to battery voltage, temperature, current, ect. It is also used to display warnings and errors.
6. Failure Modes
   1. Loss of CAN
      1. Display stale indicator activates, press e-stop, allow the car to coast to a stopping point on the side of the road.
   2. Accelerator disconnected:
      1. Motor current command becomes zero. Allow the car to coast to a stop.
   3. FNR switch disconnected
      1. The vehicle is always in neutral, unless one pin is high and not the other. Allow the car to coast to a stop.
   4. Brake pin disconnected
      1. No mitigation, driver must put the car to the stop because the brake lights won’t work. Should consider inverting brake pin logic in the future
   5. Button matrix invalid
      1. No mitigation, must press e-stop and take the car to the side of the road.
   6. Display invalid
      1. No mitigation, must press e-stop and take the car to the side of the road.
7. Testing procedures
   1. Ensure that every input stimuli on the steering wheel (accelerator pedal, brake pedal, buttons, FNR switch) lead to the CAN message which is expected.
      1. Ensure that the CAN messages occur every 100ms
   2. Ensure that every CAN message that is supposed to go to the steering wheel leads to the correct output on the display
      1. Ensure that, if they are not sent often enough, the display says that the data is stale
      2. In particular, check every condition that could lead to the driving state in precharge, regular operation, or fault modes. All other CAN messages don’t have complex conditional logic.
   3. Ensure that the cruise buttons lead to the correct output on the display
8. Bring-up procedures
   1. Make sure you soldier the buttons on the side of the board with a white trace around it
   2. There are two test points for CANH and CANL, so keep that in mind during testing
   3. Make sure to soldier on the connector for the display before soldiering on the microcontroller; it is hard to do things the other way around
   4. The display is almost guaranteed to be functional, short of any hardware issues, because a simulator already exists to test it. Quickly make sure that works. Then, test that pressing the “diagnostics” button actually changes the screen, and that the power hold mode leads to the corresponding output on the main screen.
   5. Next, make sure it inputs CAN messages. When you send any of the CAN messages that correspond to a data point on the display, does it update the data?
   6. Next, make sure it outputs CAN messages. When the brake input is high, does the brake bit on the CAN bus get activated? When the acceleration input is high, does the motor current CAN message change?
   7. Finally, ensure that the PTT button works as expected when pressed.
9. Lessons learned
   1. Many respins had to be done due to very minor details, like the size of connectors or mirrored footprints. Go through the PCB verification checklist before spinning another PCB.

[https://docs.google.com/document/d/1j9xKnNDWq94P01qC08NBHlHlFRhVTDXiV099wJHkQcc/edit?usp=sharing](https://docs.google.com/document/d/1j9xKnNDWq94P01qC08NBHlHlFRhVTDXiV099wJHkQcc/edit?usp=sharing)
