---
description: >-
  This page goes into detail about the manufacturing of the solar sub-arrays and
  main array. Included topics: encapsulation, soldering arrays, tabbing and
  connections, wiring, adhesion to top shell.
---

# Array Manufacturing

Intended Author: Arthur Chen

1. Purpose
2. Requirements
3. Architecture
4. Interfaces
5. Rationale
6. Failure modes
7. Testing procedures
8. Bring-up procedures
9. Lessons learned

## Encapsulation

The encapsulation process is a precise endeavor that is critical to array efficiency and increased power output. Properties of the materials used allow for near ideal transmission of light to the cells and some reflection back off the car and to the cells. Handing the encapsulants requires care and cleanliness. The current process was reached iteratively, and it is still an iterative process to make improvements and experiment with different layering, soldering, and wiring.

### Current Layout

The current layout, used in Lux and likely Artemis is as follows (from top to bottom):

* ETFE
* EVA
* Solar Cell(s)
* EVA
* TPE Backsheet

Possible improvements to this for weight optimization could consist of removing the further bottom EVA and just having backsheet on the bottom or replacing the TPE backsheet with ETFE. The backsheet gives structure to the array at the cost of weight, with it being the heaviest material used. For ultimate rigidity and aero-efficiency, fiberglass as the backsheet would keep the array from bending and having issues due to the way the materials are stored. The tradeoff for the ultra-stiff array is increasing the overall weight of the array.

| Current       | Lightweight I Variation | Lightweight II Variation | Rigid Variation I |
| ------------- | ----------------------- | ------------------------ | ----------------- |
| ETFE          | ETFE                    | ETFE                     | ETFE              |
| EVA           | EVA                     | EVA                      | EVA               |
| Solar Cell(s) | Solar Cell(s)           | Solar Cell(s)            | Solar Cell(s)     |
| EVA           | TPE Backsheet           | EVA                      | EVA               |
| TPE Backsheet |                         | ETFE                     | Fiberglass        |

## Array Soldering

Array soldering is the most delicate process of encapsulation. The cells are extremely fragile and must be handled in specific manner.&#x20;
