---
description: >-
  Preliminary constraints and parameters for ASC 2026. See
  https://www.americansolarchallenge.org/regulations/solar-car-design-reference-material/
  for ASC solar car design materials.
---

# ASC 2026 Car Design Parameters

## Regulation Changes for ASC 2026

From Adem, ASC staff, end of ASC 2024 awards ceremony:[https://www.youtube.com/live/n4c7g2wkM9c](https://www.youtube.com/live/n4c7g2wkM9c)

* Far past due date to release FSGP 2025 regs
* FSGP 2025 regs based on ASC 2026 regs
* Expect complete ASC 2026 regs release in early fall??
* Planning on matching WSC 6m^2 solar array size for ASC 2026
* Moving to sizing batteries based on data sheet capacitance (not weight)
* Reducing battery size somewhat, but not going all the way down to 3kWh
* WSC 2025 bounding box: 5.8 m long, 2.3 m wide, 1.65 m high
* FSGP 2025 bounding box: 5.0 m long, 2.2 m wide, 1.6 m high



## Lux System Weights and Measurements&#x20;

Composites:

* Aeroshell Bullet: 16 kg
* 4Wheel Cat: 18 kg
* Chassis Bullet: 15 kg
  * <mark style="color:green;">Rough Shape: Rectangle L80" x W24" x H21"</mark>
* Chassis Cat: 17 kg&#x20;
* Roll Cage: Steel: 13 kg
  * Import shape into NX
* Titanium Roll Cage: 8 kg
  * Import shape into NX

Mech: -Front Suspension with Wheels + Brakes: 8.1 kg each

* Wheels: 3.703 kg each
  * <mark style="color:green;">Cylinder: D550mm x W100mm</mark>
* Rear Suspension + Brakes (without wheel or motor): 2.92 kg
  * <mark style="color:green;">Bounding box: L9" x W15" x H12"</mark>
* Front Suspension + Brakes (without wheel): 8.1 kg - 3.703 kg = 4.397 kg
  * <mark style="color:green;">Bounding box: L8" x W9" x H10", 4" behind front axle</mark>
* Steering Rack: 1.4 kg
  * <mark style="color:green;">Bounding box: L40" x W5" x H5" (make cylinder)</mark>
* Steering Column: 0.5 kg
  * <mark style="color:green;">Bounding box: 65-degree angled cylinder L19.5" x D1"</mark>
* Interiors: 8 kg
  * <mark style="color:green;">Steering wheel bounding box (in front of driver): L10" x W4" x H7"</mark>
* Master cylinder + Pedal: 1.27 kg
  * <mark style="color:green;">Bounding box: L3.75" x W6.5" x H11.5"</mark>

Electrical:

* Battery: Weigh 25 kg - ish
  * <mark style="color:green;">Rough Shape: Rectangle L30" x W12.5" x H8.5"</mark>
* Motor: 11 kg&#x20;
  * <mark style="color:green;">Rough shape: Cylinder D10.3" x H2.2"</mark>
* Motor Controller: 500 g
  * <mark style="color:green;">Rough shape: Rectangle L10" x W5.5" x H1.5"</mark>

Misc:

* Driver Weight: 55 kg
  * <mark style="color:green;">Rough shape: 5' 10" driver height</mark>
* Ballast up to max weight of 80 kg

Interiors Specific:

Accelerator Pedal (missing some washers): 1.3lbs, Ballast Box Hinges and Latch(missing some hardware): .4lbs, Button Box (missing wires, nut too big): .7lbs, Canopy Hinges & Latches (missing some hardware, wire likely too heavy, massive 3d print difference): 4.8lbs, External E-stop (needs trimming, 3d print diff): .6lbs, Harness (purchased part, answer in Q\&A): 6lbs, Steering Wheel (3d print diff): 2lbs, Top Shell Hinges: (rough design, print diff): 1.2lbs, Towing Hardpoint: .1lbs on car but .3lbs with hook installed, Display\&Pi mounting box (not designed yet): .5lbs? for a grand total of 17.6lbs or 8kg.



## Why We Chose Big Bullet

There were 3 main designs that were seriously considered: 3 wheel catamaran (similar to Brunel's Nuna 11-12), 4 wheel catamaran, 3 wheel bullet. We had each team present their concerns for each design, pros and cons, and their vote for what they most prefer (1 is highest, 3 is lowest). Preliminary vehicle stability calculations were done for each configuration to determine if each shape was even feasible from a stability standpoint. For 4WCAT and Big Bullet, the 45 degree tilt test was used, and for 3WCAT, a less conservative approach of using the maximum g's achieved during dynamic scrutineering was used. See the subpage on vehicle stability for details.&#x20;

### Mechanical Considerations

**Constraints**: vehicle stability, attainable CG location, compliance with 45 degree tilt test (or dynamic scrutineering), braking regs, suspension space allocation

**Big Bullet**: Ranked 1\
Pros: Prior experience, stable at high speeds, easy CG manipulation, suspension design is easiest, fewer constraints on wheel placement, aero is not a huge constraint, symmetric wheel loads left to right, steering design is easy, we have actionable improvements from Lux, probably lightest option for mech\
Cons: We don't know vehicle size restrictions yet, 3 wheels is inherently less stable than 4 wheels (arguably). Tipping point is over the line connecting fron wheels and back wheel.&#x20;

**4 Wheel Catamaran**: Ranked 2\
Pros: Lots of prior art, inherently more stable than 3WCAT, dynamics has more stuff to play with / more potential for optimization with 4 wheels, historically "the gold standard"\
Cons: suspension packaging can be tough (all cats), stability decreases with speed (all cats), asymmetric wheel loads, CG is tougher to manipulate (all cats), arguably heavier than bullet, there's lots of unknowns with switching to catamaran, more wheel = more rolling resistance

**3 Wheel Catamaran**: Ranked 3\
Pros: it's cool as shit, lighter than 4WCAT, but also we've never made it before.&#x20;

Prior examples: Brunel Nuna 11-12, Durham University&#x20;



