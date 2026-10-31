# CAN

Intended Author: Ben Sisk

CAN definition:\
[https://docs.google.com/spreadsheets/d/1A8opqNJAr5PibVa-TiA\_B-YKhgXH7S0KIr07IEJ8pL8/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1A8opqNJAr5PibVa-TiA_B-YKhgXH7S0KIr07IEJ8pL8/edit?usp=sharing)

1. Purpose

CAN is the primary communication protocol used throughout the car. The steering wheel, power distribution board, MPPTS, telemetry board, motor controller, BMS, and charger all communicate with each other on the same two wire bus.

2. Requirements
   1. CAN messages must be sent at a consistent frequency
   2. The CAN bus must be resistant to electromagnetic noise
   3. The CAN bus must not assume that single messages won’t be dropped (no edge sensitive messages)
   4. CAN bus messages must have an obvious sender and receiver
   5. The structure of a CAN message must always be consistent during operation
   6. Checks must be done in software to ensure that the correct number of bytes have been received for a given CAN message
3. Architecture
   1. Every can line must have two wires: CANH and CANL. These two wires must be connected with each other using 120 ohm resistors.
   2. Each board must have two connection points with the CAN line, because the CAN line has to pass through each component.
   3. Endpoints are devices with one of the two 120 ohm resistors.
   4. System CAN Baud-rate: 500kps
   5. Ideally, the CAN connection points use RJ45 connectors, but in practice other connectors are used for compatibility with off-the-shelf parts.
   6. The can library has a file which describes the CAN definition in exact detail. It should always reflect the CAN definition spreadsheet, which is the source of truth.
   7. Other architectural details regarding CAN are in the can definition spreadsheet.
4. Rationale
   1. The method of choosing IDs for CAN messages came from the fact that the CAN protocol prioritizes lower CAN ids. Safety critical messages were prioritized over supplementary telemetry messages
   2. Every CAN message has distinct sources and destinations because it is easy to do so at this scale without filling up all the CAN ID space. It is entirely possible that strategies to make better use of the CAN ID space will be required in the w.
   3. Every CAN message must have very clear intervals when they are sent. If they are sent too often, the CAN bus will experience congestion. If they are not sent often enough, the data gets stale and other boards might need to start assuming that something has gone wrong
   4. Whenever possible, effort was made to make the endianness consistent. Regular data is always MSB first, while floats are LSB first as required by the prohelion motor controller.
   5. BXCAN is preferred over FDCAN because the additional performance and ID space just aren’t necessary for the complexity of the vehicle. One also has to worry about finding FDCAN compatible devices, otherwise the bus will need to be mixed. The one exception is the charger, which requires BXCAN.
5. Failure modes
   1. Incorrect resistance values
      1. Check the resistance beforehand
   2. Incomplete can line
      1. Ensure continuity across the CAN line with continuity testing and visually looking at the CAN line
   3. Congested CAN bus
      1. Ensure that there are no messages which send as soon as possible
   4. Missing CAN messages
      1. Investigate the CAN node in question
   5. Incorrectly formatted CAN messages
      1. Check endianness, bx vs fd CAN, ect.
6. Testing procedures
   1. Before doing anything, double check the resistance of the resistors and the CAN line itself. Is each resistor (outside of the circuit) 120 ohms, and the resistance across CANH and CANL 60 ohms? If not, you need to look at the can line carefully.
   2. Begin the CAN line with just two end nodes with terminating resistors. Ensure that the two devices can communicate with one another. Insert dummy messages for testing or to make the node operate normally.
   3. Add more devices (without terminating resistors) one at a time, and ensure that everything is still functional.
   4. Further details are in this document from TI: [CanDebugging.pdf](https://drive.google.com/file/d/1eYhTU2g3-w1VyESHFbP1kpS3TcqeRlkl/view?usp=drive_link)
7. Lessons learned
   1. FILL IN AFTER FSGP/ASC

[**https://drive.google.com/file/d/1wmODFYLXPREFK\_ySC6C1d4MLj0eTrIHK/view?usp=sharing**](https://drive.google.com/file/d/1wmODFYLXPREFK_ySC6C1d4MLj0eTrIHK/view?usp=sharing)
