# Safety Board

Intended author: Ben Sisk

[https://drive.google.com/file/d/1o9p1oKctbHI8e-OkeHg9tV3tqdqcNlOJ/view?usp=sharing](https://drive.google.com/file/d/1o9p1oKctbHI8e-OkeHg9tV3tqdqcNlOJ/view?usp=sharing)

1. Purpose
   1. The purpose of the safety board is to keep the low voltage and high voltage systems safe from hazards in a timely manner, and protect people from electrical-related hazards. This includes the battery, which needs to be electrically disconnected from everything in the car when unsafe. Hazards include undesirably high or low voltage and current, isolation violations, high battery temperature, BMS faults, contactor faults, and communication errors making the previous hazards on the BMS or power distro baord unverifiable. These hazards need to be responded to in a timely manner for the safety of the driver and to keep the car in good condition. Note that the purpose of the safety board is NOT limited to complying with regulations: there is plenty of room to make a disastrously unsafe car within the regulations.
2. Requirements
   1. The maximum and minimum voltage of every active bus on the car must stay within the normal operating range of every part of the car required by regulations. For the 2026 car, this was 9-15 volts for the low voltage system and 120-155 volts for the high voltage system.
   2. The maximum current must reflect what can realistically be taken out of the battery on the high voltage bus, and must be low enough on the low voltage bus to detect any serious issues. For the 2026 car, this was 30 amps and 0.9 amps respectively.
   3. The current should never be negative, unless regen braking is implemented, which it was not on this year’s car. In practice, this means that minimum current should be about -100 mA for both high and low voltage.
   4. The two most important errors which must be accounted for are isolation faults and contactor faults (inability to close contactors and isolate battery under fault).
   5. CAN failures must count as errors; if a device cannot communicate with another device then it must assume the worst case scenario.
   6. The car should respond to any violations of the normal operating conditions within 250ms. This not only includes making any preventative actions but also notifying the driver that there is a problem.
   7. The battery fan should always be on during operation and ensure that the battery never overheats.
3. Architecture
   1. The critical action performed when there is a hazard is the opening of the four contactors on the car. Contactors are electronic components that are designed to enable or disable current flow at high voltages and currents. There are four contactors: two control both sides of the battery, one controls the charging system (MPPTs + solar charger), and one controls the precharge resistor (closing this contactor shorts the resistor which absorbs current/voltage spikes on startup).
   2. The solar car does not have a singular authority responsible for battery protection. Instead, the BMS monitors the high voltage system and the power distribution monitors the low voltage system. The power distribution board powers four relays, whose input comes from the BMS (except for precharge, whose input is just power) and whose output activates each contactor. Therefore, if either system determines that the car is unsafe, the battery is disconnected from the car.
   3. As an additional precaution, the power distribution checks the state of the BMS (the DTC flags) to ensure that high voltage faults are caught if the BMS is somehow unable to open the contactors on its own.
   4. The steering wheel receives CAN messages from the BMS, power distro board, and motor controller to assess the current safety of the car; if it is unsafe, the user is alerted. The exact warnings are too numerous to mention here, but there are three categories of these messages: warnings which don’t indicate that the contactors should be open and can be mitigated, errors which do indicate a problem that should lead to the opening of the contactors, and faults that are so severe that a special warning is given to the user.
4. Interfaces
   1. The BMS sends messages to the power distro board and steering wheel, the power distro board and motor controller send messages to the steering wheel, and the steering wheel sends messages to everything but the BMS. In this way, the BMS, power distro board, and motor controller act as monitoring systems while the steering wheel acts as the I/O.
   2. The BMS and power distro board share the contactors. The BMS controls the signal pin of a relay and the power distro board controls the power pin. The output pin of the relay is what actually actuates the contactor. The exception is the precharge, which the power distro also controls the signal pin for.
5. Rationale
   1. The separation between high voltage and low voltage is sensible for battery protection. However, the LV team will look into consolidating more of the logic onto the power distro board and possibly add high voltage monitoring elements. This will provide the luxury of using the BMS as essentially a backup for battery protection.
   2. The relay/contactor architecture is necessary so one component failure does not mean that the car remains in an unsafe state. Similarly, two main contactors are used so that the battery is still disconnected if one fails.
6. Failure modes
   1. Contactors - there are only two contactors on the battery, so if they both fail, there is no way that the BMS or the power distribution board can disconnect the battery. The only time that the effectiveness of the contactors can be automatically tested is when they are open (on fault). For this reason, the contactors should be manually checked before and after driving the car.
   2. CAN communication - as soon as CAN communication is lost, this entire car monitoring system fails. The contactors still actuate as normal for the most part, except the power distro board cannot independently
7. Testing procedures
   1. Start with testing each component individually
   2. Test the BMS with the power distro board. A fault identified by the BMS should lead to the relay attached to the contactors to lose power and the signal should be low. Make sure to account for stale messages on the power distro board (temporarily disable any checks that require the power distro board to receive signals from the steering wheel).
   3. Test the steering wheel with the motor controller. Make sure to account for the fact that the steering wheel only allows a nonzero velocity under specific conditions, hardcode this condition to be true or send the right CAN messages to make it true.
   4. Test all four components together. Use the display and terminal if necessary for debugging.
8. Lessons learned
   1. Will find out during race!
