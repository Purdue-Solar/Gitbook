---
description: >-
  Artemis' front suspension was pretty similar to Lux except for the big
  difference of the pushrod.
---

# Designing

## Change from Lux

* improve serviceability and adjustability
  * being able to physically assemble and repair more easily
  * being able to change control arm angles
* started using Lotus Shark, a suspension modeling software that is very old and one should not be able to download it (but one can from the right reddit post)
  * this helped with tuning suspension geometry and reducing camber gain
* intro of chamfered chassis in order to have pushrod mounted on the corner of the chassis
* gas shocks new
* trying to avoid pushrod buckling or any rod buckling, or bottom out or binding

## Specific Topics

### Hub Nut

* wheel hub nut almost fell off Lux and therefore wheel almost fell off during the race, which the driver heard and saved the car by insisting on stopping to check it
* hub nut Artemis planned to be torqued down properly to 120 ft-lbs with a socket, and then stick a large 1/8" R-clip through it and the hub

\[insert how the shock delaminated cuz of the big ol bending moment, and other considerations with pushrod]

### Shock Mounting

**Direct Chassis Shock Mount**

In commercial vehicles, shocks are often mounted directly to the chassis. This simplifies design and reduces cost compared to push or pull rod systems. However, our wheels will be too far away from our chassis for this to work properly.

#### Push Rod vs. Pull Rod Suspension Systems

Push rod and pull rod suspension systems are methods used to connect the suspension components to a vehicle's chassis, each offering distinct benefits and drawbacks. Push rod systems are favorably simple and cost-effective, while pull rod systems enhance weight distribution and aerodynamics but at a higher complexity and cost.

**Push Rod:**

* Mounted from the upper part of the chassis to the lower wishbone
* Simpler design, easier access, and cheaper.
  * Reduces chassis complexity
* Increases the car's center of gravity (CG).

**Pull Rod:**

* Mounted from the lower part of the chassis to the upper wishbone
* Provides lower center of gravity.
* More complex, harder to access for assembly and maintenance

These systems are often combined and one is used in front and other is used in the rear. We only care about front though.

**Decision:** Push rod is much more feasible to implement and the CG impact is negligible.
