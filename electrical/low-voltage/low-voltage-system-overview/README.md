# Low Voltage System Overview

Intended author: Ben Sisk

[https://docs.google.com/presentation/d/1cm\_Nzz6I1eJ9NbUj0FWpZ6vXEKCw\_S2m262I6mQ57Hw/edit?usp=sharing](https://docs.google.com/presentation/d/1cm_Nzz6I1eJ9NbUj0FWpZ6vXEKCw_S2m262I6mQ57Hw/edit?usp=sharing)

1. Purpose
   1. The purpose of the low voltage system is to ensure the safe operation of the car, comply with regulations, and allow the user to modify the operation of the car. What differentiates low voltage from other parts of the car is that the team works on dynamic and intelligent components which respond to the outside environment, namely PCBs and microcontrollers. Despite being considered “low voltage”, safety is still an important consideration, because low voltage components interface with and control the rest of the car. The primary responsibilities of the low voltage system are system and user protection, propulsion control, CAN communication, regulatory compliance, and telemetry
2. Requirements
   1. For battery protection related items, see the safety protection section, which has the most stringent requirements.
   2. Power distro or BMS failures should open contactors and prevent the motor from being operated; motor failures should only prevent the motor from being operated. In practice, this means that the drive system has to decide whether driving is safe, independently of the safety protection system.
   3. Fault monitoring should be decentralized to maximize protection. If one board suddenly fails, another board should detect the issue and take preventative action. In practice, this requires that each major board check the state of the other boards on the CAN bus and flag an issue if the messages aren’t being sent often enough.
   4. Each system must only be responsible for tasks related to their function. For example, the power distro board sends the steering wheel a message saying that there was a contactor fault rather than the steering wheel doing so even though the steering wheel is fully capable of detecting this fault. This prevents excessive interdependencies and scope creep.
   5. Have explicit ownership of tasks, don’t duplicate functionality (see examples)
      1. BMS owns battery safety.
      2. Power Distribution owns low voltage protection and distribution.
      3. The drive system owns propulsion.
      4. The steering wheel owns driver inputs.
      5. The display owns all visual output and user warnings
   6. Systems must always assume that there is a problem then disprove that problem with convincing evidence rather than assuming that there is no problem unless proven otherwise.
   7. Components must enter a safe state upon failure. For example, a steering wheel which can’t see CAN messages must assume the worst and disable the motor, and a power distribution board which can’t check the voltage of a battery must open the contactors.
3. System decomposition
   1. safety protection - see separate section
      1. Contactors
      2. Startup board
      3. Power distribution board
      4. BMS
      5. Display
      6. Battery fan
   2. Drive - responsible for determining whether the car should move, in what direction, and how much. This information is also put on the display.
      1. Steering wheel
      2. Startup board
      3. Display
      4. Motor controller
   3. CAN system - responsible for inter-component communication
      1. CAN protocol
      2. CAN debugger
      3. CAN library
   4. Regulatory compliance
      1. Backup camera
      2. Light boards
      3. Driver fan
      4. Horn
      5. Comms Radio
   5. Telemetry
      1. Telemetry board
4. Architecture
   1. The low voltage system has two sources of power: a 13.8 volt aux battery with a wide operating range (around 9.8-14.8) and a 13.8 volt power source which is converted from the lithium ion battery. In practice, this means that all components need to be able to work under a wide operating range.
   2. Every major intelligent subsystem communicates over CAN. This is so that they can all communicate their health, issues, and provide telemetry useful data.
   3. Instead of a single board or component controlling the car, they all control their own aspect of the car and collectively make decisions about how the car should act.
5. Interfaces
   1. Inputs
      1. Startup board
         1. FNR (Forward Neutral Reverse) switch
         2. Keyswitch
      2. Steering wheel
         1. Button matrix
         2. Brake
         3. Accelerator
         4. Push to talk (PTT) button
   2. Outputs
      1. Display
      2. Motor
      3. Contactors
      4. Lights
      5. Telemetry (radio)
      6. Fans
      7. Horn
      8. Comms Radio
6. Rationale
   1. We have a CAN protocol spreadsheet and corresponding c++ header so that the different boards do not disagree on how to communicate between each other. The CAN protocol spreadsheet should be considered the primary source of truth. CAN is used in general because it is resistant to electronic noise and is very flexible.
7. Failure mode
   1. When the CAN bus stops working, the entire system is not operational. Safety critical systems must assume the worst and shut the car off. Very little telemetry can be sent under this condition
   2. Much of the thought and work that goes into the car is related to the main battery. Lithium ion batteries are particularly dangerous because they can overheat, catch fire, and explode. Lithium ion batteries have to be consistently monitored.
   3. The auxiliary battery is much less likely to become unsafe than a lithium ion battery, but it also should be manually checked on. If the auxiliary battery runs out of power, the critical safety systems cannot operate.
   4. BMS failure is unlikely, but it must force the contactors to open, prevent driving, and display the relevant error
   5. Steering wheel CAN failure must also force the car to stop and the contactors to open. All communication with the driver is lost when the steering wheel and the display fails. Steering wheel failure automatically stops the motor from moving because the motor controller stops driving the motor when no can message is received.
   6. Telemetry failure, fan failure, and any board related to regulatory compliance rather than safety should not be of consequence to the operation of the car. Some thought should maybe be put into detecting fan failure, since that could theoretically cause issues for the battery.
8. Testing procedures
   1. PCB subsystem testing
      1. Testing should always begin on the component level, in parallel with code testing. After PCB bringup, ensure that the physical characteristics of the pcb are correct. Are there any shorts? If I input a signal here, do I get the correct output? Test anything and anything that doesn’t require a microcontroller first. Often people find that the bug in their code was just something soldiered wrong.
   2. Code testing
      1. In parallel with PCB testing, code testing should occur. Even without physical access to a board, a surprising amount can be tested. Inputs and outputs can be hard coded, or even simulated over time. If you have enough time, create a small pcb where the code can be tested independently.
   3. Board testing
      1. Next, test the characteristics of the entire board, and if applicable, the microcontroller. At this point, you should modify the code a bit and hard code values so that you understand the behavior of the board in isolation without CAN. This is because CAN can be a pretty non-ideal environment and it relies on complete compatibility with other components.
   4. Simulated CAN testing
      1. Next, remove many hard coded values and test the board’s actual response to real inputs. This can be done with microcontrollers or CAN debuggers. Ensure that your inputs match the CAN specification rather than the code. This shouldn’t be too complicated if board testing was done diligently.
   5. Bench integration
      1. If a vehicle is not physically available, it is still possible to do system level testing through bench integration, with the possible exception of the motor. This involves physically connecting components together on the CAN bus. Make sure that you have two 120 ohm terminating resistors. Check that the resistance across CANH and CANL is 60 ohms. If it is 120 ohms, you only have one terminating resistor. If it is zero ohms, you have a short.
   6. Vehicle integration
      1. This is like bench integration, but with physical mounting components. Make sure to have a clear wiring plan before beginning wiring! Make sure that everything makes sense mechanically as well. For instance, the electrical team found that petg brakes are prone to snapping. In addition, at this point, or in bench integration, fault testing should start. System level testing of faults is critical because most engineering accidents occur at the systems level.
   7. Dynamic vehicle testing
      1. Getting a lot of miles before starting the race is critical. This is how telemetry is collected, and rarer issues are found. Continue with system level fault testing. Some examples of fault testing might include injecting BMS values with a DTC fault (some issue with the BMS). Do mock scrutineering tests, especially the BPS testing.
9. Lessons learned
   1. Design for observability.
   2. Every CAN message should have a timeout.
   3. Every fault should have a clear owner.
   4. Never allow one subsystem to silently assume another subsystem is working.
   5. Test subsystems independently before integration.
   6. Safety takes precedence over vehicle operation.
   7. Every subsystem has a single, clearly defined responsibility.
   8. Fault detection is distributed rather than centralized.
   9. Systems fail to a safe state whenever uncertainty exists.
   10. Communication is standardized over CAN.
   11. Boards should be individually testable.
   12. Components should expose sufficient telemetry to diagnose failures.
   13. Architecture should favor maintainability over minimizing PCB count.
