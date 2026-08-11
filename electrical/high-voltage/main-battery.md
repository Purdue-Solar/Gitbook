# Main Battery

Intended author: Han Luu

1. Purpose: Solar energy storage to power motor and low-voltage distribution board
2. Requirements:
   1. Capacity: <5.25kWh
   2. Voltage constraints (refer to Motor section for more details):
      1. Motor input voltage: 96Vnom; 45V-140V
      2. Motor controller continuous Vmax: 165V
3. Architecture:
   1. Cell: Samsung INR-21750E
   2. Pack configuration: 36s8p; 18 modules of 2s8p
      1. Voltage (Min/Nom/Max): 97.2/130.68/151.2
4. Interfaces
5. Rationale
6. Failure modes
7. Testing procedures
8. Bring-up procedures
9. Lessons learned

**Gitbook notes:**\
Constraint: 5.25 kWh storage cap 18650 battery store - Samsung INR21700-50E\
Cell nominal voltage: 3.63V\
1C = 4.9Ah\
\=> In Wh = 17.8 Wh/cell\
Average resistance: 14mOhm/cell\
Old design: 29s10p\
For series: (3.7\*29) = 107.3V\
For parallel: 4.9 \* 10 = 49 Ah\
Pack power/capacity = 107.3 \* 49 = 5.258 kWh\
Total num of cells: 290 cells\
Current design: 36s8p for the whole pack. 2s8p per module\
For series: (3.7 \* 36) = 133.2 V\
For parallel: 4.9 \* 8 = 39.2 Ah\
Total resistance per module: 2 strings of 8 parallels: Rtotal = 2\*(14mOhm/8) = 3.5 mOhm\
Pack power/capacity = 133.2 \* 39.2 = 5.221 kWh\
Total num of cells = 36\*8 = 288 cells\
⇒ Internal loss (assuming all internal resistance is maintained:\
Ploss(old) = I^2\*R = 49^2 Ah/R\
Ploss(new) = I^2\*R = 39.2^2 Ah/R\
Reduces loss by: (39.2^2-49^2)/49^2 = 36%\
Criteria for modules going on the pack:\
Resistance of < 0.2 mOhms difference per module\
Battery hardware:<br>

<img src="../../.gitbook/assets/unknown (4).jpeg" alt="" height="429.8613861386139" width="321">

<img src="../../.gitbook/assets/unknown (5).jpeg" alt="" height="234" width="280">

Radlocks RL9036-101 radloks - M4 (get M4 nuts)\
Nickel cutting - Nickel 201 0.5mm thick\
Spotweld settings: 6V\
33ms for battery pack\
6ms for wires (smaller stuff)
