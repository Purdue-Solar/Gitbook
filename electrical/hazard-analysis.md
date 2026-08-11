# Hazard Analysis

Accidents

* Catastrophic
  * People are injured or killed.
  * Another vehicle or property is damaged because of the solar car.
* Major
  * The solar car is permanently damaged.
  * The solar car becomes unsafe to operate.
* Minor
  * The car cannot complete the race.
  * The car is disqualified.
  * The car cannot legally operate on public roads

Hazards, causes, and mitigations

* Hazard: People are exposed to electric power
  * Battery
    * Cause: Battery enclosure opened while energized
      * Verification: Only battery trained personnel should operate the battery, touch the battery, or even get near the battery.
      * Verification: All HV systems, including the power distro board, must be permanently placed in the battery box.
      * Verification: During the race, the battery box must be placed in an impound box according to regulations and sealed.
  * BMS
    * Cause: Failure to put BMS in battery box
      * Verification: The BMS should be permanently placed inside the battery box.
    * Cause: Failure to detect isolation fault
      * Verification: The isolation fault sensor should be regularly checked for accuracy
    * Cause: Failure to report isolation fault
      * Verification: The BMS configuration should be checked before operation.
  * Power distribution
    * Cause: Power distribution board touched when energized
      * Verification: The power distribution board should always be in the battery box.
    * Cause: DC-DC converter short leading to hv on lv bus
      * Constraint: The power distribution board should open the contactors if the voltage gets too high.
  * CAN
    * Cause: Failure in communicating faults between BMS and display
      * Constraint: All programs and off the shelf parts must refer to c++ header specification, which comes directly from CAN spreadsheet.
  * Motor controller
    * Cause: Motor controller touched when energized
      * Verification: The motor controller should only be touched when high voltage is off.
      * Constraint: The motor controller should have housing which makes it difficult to touch.
  * Display
    * Cause: Failure in communicating isolation, hv faults with user
      * Constraint: The display must have a watchdog which ensures that it is receiving messages from the BMS frequently enough.
      * Constraint: Display must prioritize the faults and separate critical faults from less critical faults.
  * Contactors
    * Cause: Contactors welded closed
      * Verification: The condition of the contactors should be checked before they are turned on and before the end of racing for the day.
      * Constraint: Under fault conditions, the contactors also must be checked automatically. If the contactors are not disconnecting the battery, the display must indicate that there is a contractor fault.
    * Cause: Unexpected contactor closure
      * Constraint: The contactors should only ever be closed if the BMS says the battery is in a safe state AND the power distro board says the low voltage systems are in a safe state. This is especially true on startups.
      * Constraint: The contactors should be pulled low; a lack of input should make the contactors open by default.
    * Cause: Unclear HV state
      * Constraint: An indicator lamp should show whether the hv bus is active, independent of the LV bus.
* Hazard: Vehicle experiences uncontrolled propulsion.
  * BMS
    * Cause: the BMS does not accurately report the current limit
      * Constraint: The BMS must report an accurate discharge current limit value so that the motor controller can set an accurate bus current limit.
    * Cause: the BMS unexpectedly keeps contactors closed during a fault
      * Verification: Ensure that the BMS opens the contactors when power distro board faults are simulated during testing.
      * Constraint: If the contactors are not disconnecting the battery, the display must indicate that there is a contractor fault.
  * Power distribution
    * Cause: the power distro board unexpectedly keeps contactors closed during a fault
      * Verification: Ensure that the power distro board opens the contactors when power distro board faults are simulated during testing.
  * CAN
    * Cause: General CAN failure
      * Constraint: All programs and off the shelf parts must refer to c++ header specification, which comes directly from CAN spreadsheet.
    * Cause: Miscommunication between the BMS and steering wheel / display
      * Constraint: Ensure that either the BMS or steering wheel is adjusting the DCL to account for the current from the LV system
    * Cause: Miscommunication between the steering wheel / display and motor
      * Constraint: Ensure that the motor being used automatically stops driving the motor when a CAN message is not received often enough
      * Constraint: Ensure that the CAN spreadsheet and the datasheet of the motor match up
  * Motor controller
    * Cause: Faulty motor controller
      * Constraint: Motor controller must stop upon fault
      * Verification: Ensure that the driver understands that motor faults don’t lead to the opening of contactors
    * Cause: Incorrect velocity data
      * Verification: Independently check whether the velocity values coming from the motor controller match what is being seen in real life
      * Verification: Ensure that the motor controller configuration includes the size of the wheels
  * Display
    * Cause: Unintuitive interface
      * Constraint: Must indicate the current velocity of the vehicle
      * Constraint: Must clearly indicate when power hold is enabled and disabled
      * Constraint: Must clearly indicate when and why the motor controller is disabled or limited
      * Constraint: Must clearly indicate the state of the vehicle
      * Constraint: The steering wheel must not be capable of displaying error messages which contradict the state of the car (ex: if an error is displayed which should disable propulsion, propulsion must actually be disabled)
  * Steering Wheel
    * Constraint: Accelerator must be calibrated before the race for driver preference
    * Verification: Ensure that the velocity values being read out on the steering wheel make physical sense
    * Constraint: Must prevent reverse while still having a significant positive velocity (set velocity to zero)
    * Constraint: Buttons for power hold must be easily accessible
    * Constraint: Must prevent motor controller from having a nonzero acceleration when there is an electrical fault or a motor controller error
* Hazard: Vehicle loses propulsion unexpectedly.
  * BMS
    * Cause: the BMS erroneously opens the contactors when there is no fault
      * Verification: Ensure that the BMS settings are good before the race and that everything is connected properly. Don’t make any changes to the BMS settings without testing.
  * Power distribution
    * Cause: the power distro board erroneously opens the contactors when there is no fault
      * Verification: Check that the power distro board only opens the contactors in the case of a fault. In particular, check the state of the contactors themselves during testing rather than what is going on from the perspective of the MCU.
    * Cause: the power distro board loses power, startup power disconnected
      * Verification: Ensure that the driver knows that low voltage power loss is also motor loss (unable to send new commands to the motor controller over CAN)
    * Cause: FNR switch on startup board disconnected
      * Verification: Ensure that the driver understands that turning off high voltage power will stop the car immediately while turning off low voltage power will stop the car within 250 ms.
  * CAN
    * Cause: Unreliable CAN bus (which trips watchdogs)
      * Constraint: Ensure that CAN messages are not overflowing the CAN bus by making sure that all devices have set transmission periods which match what is in the CAN definition spreadsheet
      * Verification: Ensure that the physical characteristics of the CAN bus make sense (ex: 60 ohms on multimeter)
    * Cause: Incorrect bus current limit conversion
      * Constraint: Ensure that the BMS is (indirectly through the steering wheel) converting the current limits properly
  * Motor controller
    * Cause: Motor controller fault / limits
      * Constraint: Ensure that the motor controller sends the limit flags and that they are being received properly
      * Constraint: If at all possible, also test that the error flags work properly
  * Display
    * Cause: Unintuitive interface
      * (see earlier “Unintuitive interface” section)
      * Constraint: Ensure that for every reason that the steering wheel prevents acceleration, there is always a corresponding error on the display
      * Constraint: Indicate when acceleration is being completely disabled on the display
      * Constraint: Identify the limiting factor for acceleration at all times
      * Constraint: Show data points that help the user predict when acceleration will be limited
  * Steering Wheel
    * Cause: Failure to send acceleration messages properly
      * Constraint: Ensure that messages are sent often enough for the motor controller to keep moving (for the prohelion motor controller, this is 250ms max)
    * Cause: Loss of connection with acceleration pedal / pedal hardware breaks
      * Verification: Ensure that the driver knows that turning off the low voltage system is the correct course of action when the acceleration pedal brakes
  * Contactors
    * Cause: Glitchy contactors
      * Verification: Ensure that the behavior of the contactors is consistent and matches the state of the BMS and power distro board, within reason.
      * Constraint: Ensure that the relay for the contactors operates in a range which matches that of the BMS and power distro controlling it
* Hazard: Battery operates outside safe or operational limits.
  * Causes
    * Battery
      * Cause: Faulty connections
        * Need to get more detail from Han + Vivian + Gavin
      * Constraint: Ensure that the battery always has a fuse
      * Verification: Ensure that the battery’s fuse value is correct before racing
      * Overcurrent
      * Overvoltage
      * Cell imbalance
      * Overtemperature
      * Undervoltage
    * BMS
      * Cause: BMS misconfigured
        * Verification: Ensure that the batteries are healthy when managed using the BMS before driving in the race
        * Verification: Use version control systems to ensure that the right BMS configuration is always loaded
      * Need to get more detail from Han + Vivian + Gavin
    * Power distribution
      * Cause: Contactor latched open
        * Constraint: It is preferable if the power distribution board eliminates power from the relay if there is a BMS fault as a backup in case something goes wrong with the BMS
    * Motor controller
      * Cause: motor current limit improperly set
        * Constraint: Set the max bus current limit below what the battery can provide by itself, accounting for the current draw of the low voltage system
        * Verification: Ensure that during testing, setting the max bus current limit on the motor from the steering wheel does not hit the absolute current limit on the battery without solar power
        * Verification: Ensure that the driver and other engineers understand that the BMS only controls the current through the contactors, therefore the rest of the system is responsible for keeping the current at operational levels and avoiding a fault.
    * Contactors
      * Cause: Contactors non-operational
        * Verification: Ensure that the BMS and power distro board are connected to the relay and the relay is connected to the contactor in the way which is desired
* Hazard: Safety-critical components become unpowered.
  * BMS
    * Cause: Power loss from the power distro board
      * Constraint: BMS must be operational for a short period of time even after power is disconnected. The Orion BMS can do this.
    * Power distribution
      * Cause: Sudden loss of auxiliary power
        * Verification: Ensure that the driver understands that if the display is not visible, all critical safety systems have been lost and turning both the high voltage and low voltage systems is necessary.
      * Cause: Sudden loss of main low voltage power
        * Verification: Ensure that the driver understands that a loss of low voltage power does not mean a complete loss of control of the battery protection system: if it is the main low voltage bus, the safety systems should be active.
        * Constraint: Ensure that the power distro board indicates a low voltage fault when power is completely disconnected from the low voltage line
    * CAN
      * Cause: Sudden loss of power
        * Verification: Ensure that the loss of power for one node on the CAN bus does not prevent the other devices from communicating with each other.
        * Verification: Ensure that the driver understands that the critical safety systems can still communicate over CAN in the case of a main LV line fault, but not for aux power.
    * Motor controller
      * Cause: Sudden loss of power
        * Verification: Ensure that the driver understands that if any low voltage power is lost, the motor controller will no longer operate within 250 ms
    * Display + Steering wheel
      * Cause: Sudden loss of power
        * Verification (same as above): Ensure that the driver understands that if the display is not visible, all critical safety systems have likely been lost and turning both the high voltage and low voltage systems is necessary. In addition, any other control actions are potentially unsafe, as there is no way to know what errors are hidden because the display is unpowered.
    * Contactors
      * Cause: Sudden loss of power, contactors open
        * Verification: Ensure during testing that when no high voltage is present, the power distro board is able to detect a main low voltage fault because no power is coming from the DC-DC converter. This must happen if the contactors are open, as there would be no HV power.
      * Cause: Sudden loss of power, contactors closed
        * Verification: Ensure before and after racing that the contactors are not fused and don’t have any other similar problems. If this occurs during the race, it is a very bad scenario because the user will not be able to detect if the power distribution board or steering wheel loses power and the entire high voltage system is still live.
