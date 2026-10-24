# Future electrical team improvements

**Design ideas**

* Currently, the CAN bus supports 1.5A. Why does it need to be this high? This would require a lot more copper to support the pcb. Is this needed?
* Separate BPS system for safety (safety board).
  * Is it possible to add isolation monitoring here
  * “Only one isolation fault detection system can be installed on a DC bus at any given time as the detection circuit AC signal will interfere with other systems and produce invalid or unreliable results. If the BMS will be used in a system where other isolation fault detection devices are used, the circuit on the BMS must be physically disabled.”
  * priority-based power allocation
  * fault-tolerant redundant rails
  * autonomous recovery logic
  * current trend prediction
  * per-load efficiency monitoring
* Embedded code essentially has no portability (abstract logic from application).
* Telemetry draws a lot of power (12W) with a high periodic requirement. Need a new better power rated radio.
* Lidar also draws too much power (1W max)
* Regenerative breaking and cruise control
  * Need to understand why our HV architecture is not compatible with backwards current
* Potentially find an alternative for radlocks, Vivan says they dominate the resistance compared to the batteries
* Look into conformal coatings and waterproofing
* Find a better way to attach thermocouples to batteries (no electrical tape)
* Investigate whether better gas dissipation is needed for battery box
* DBC / can spreadsheet to code converter so that the can library can be modified visually
* Improvements in the quality of our battery manufacturing
* Find a better way to do voltage taps
* Dyno (very important, we don't have much documentation, really useful for strategy + looking at the efficiency of the car)
* Change battery configuration, possibly make the battery bigger
* Potentially research new solar cells (possibly our current manufacturer went bankrupt)
* Bypass diodes
* Research whether additional electronics would be helpful to regulate HV/LV systems. Currently we are using the aux battery directly (just a fuse), and using the dc-dc converter to do all of the regulation on the lv line. I (Ben) don’t know what electronics are used to regulate the HV line besides the BMS, if there is any.
* Distributive health monitoring of nodes on the can bus
* “Smart” contactors
  * welded contactor detection
  * precharge curve fitting
  * bus capacitance estimation
  * insulation degradation trend monitoring
  * contact resistance estimation over time
* Better analog PCB design
* Intelligent cooling system
* Ride height / suspension / aerodynamics telemetry
* QOL telemetry improvements (work with strategy)
* PSR microcontroller
* Better connectors
* Better fault handling for software
* Add additional sensors for telemetry
* Add emergency sound to steering wheel

**Onboarding ideas**

* Keep things hands on, don't just read all day
* Don't overcomplicate onboarding
* Do a project where there is immediately visual output
* Make sure that your onboarding is generalizable to different projects
* Soldiering camp
* More than just basic kicad tutorial
* Overview of the whole electrical system
* All four teams
* Invite sid as guest speaker
* Week 1 - everything Week 2 - systems, technical onboarding
* Need time for everyone to explore different options
* Refresher on how EVERYTHING connects electrically and what all the boards all
* Everything that you need to know before the race, what can go wrong (including error messages not showing per regs)
* read regs
