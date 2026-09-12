---
description: Concepts + quick definitions
icon: head-side-brain
---

# Good to Know

#### Stiffness vs Strength

Stiffness and strength are different concepts. Stiffness is about rigidity, and strength is resistance to breaking or permanently bending. A rope can be very strong but is not stiff, whereas a glass vase is stiff but can break easily.

#### Track Width & Wheel Base

Track width is the distance between the contact patches of the front wheel (center to center). Wheel base is the distance between the front contact patches and the rear contact patch (center to center). These are two core dimensions that, like CG height, should be decided as part of the design very early on. The ratio between track width and wheelbase has to be near 1:2 (according to the rules!) for stability.

#### Ballast

In the race regulations, drivers across all solar car teams must weigh 80 kg. In order to make this happen, we are required to place a ballast within a short distance of the driver's sitting position. The ballast AKA ballast bag is a bag of (usually) lead pellets that will be heavy enough to bring the driver's weight up to 80 kg.

#### Fore and Aft

Fore refers to the direction towards the front of the car longitudinally. If the driver is sitting looking forward, they are looking fore-wards. Aft is the opposite. We use these terms especially when describing front suspension parts. Additionally, when we refer to the right side and the left side of the car, it is from the driver's perspective.

#### Stock

Stock refers to un-machined material. This might be a cylinder of aluminum, or a chunk of bronze, or a cube of steel, or whatever.

#### Center of Gravity

Also known as center of mass, CG, or CoG. The car has a center of gravity that we design to be in a certain location by placing large weights (battery, driver) along deliberate locations in the car. The CG has 3 coordinates in the 3D Cartesian coordinate system - x, y, and z. X is longitudinal (forward and back of car), Y is lateral (left and right of car), and Z is height (up and down). The CG height is important in weight transfer calculations as well as for the stability of the car overall.&#x20;

#### Finite Element Analysis

Finite element analysis, or FEA, is a kind of simulation method that allows you to run static stress simulations on CAD modeled parts. Softwares like Ansys or NX will take a CAD model and create a mesh, which models the surface of the part with a lot of tiny geometric shapes (finite elements) that allow it to analyze how the part responds to forces. "FEA" is more or less interchangeable with "stress simulation".

At its simplest, running FEA means putting forces on your part in your computer and letting the colors tell you where it will break. This saves oodles of the money and time it would require to physically make parts to see how they break.

#### Loading

In statics, the word "load" pretty much means "force". A lot of our calculations are statics problems in disguise. For suspension to be "fully loaded" means the full weight of the car is resting on it normally, meaning the shock will probably be compressed by some amount, and the control arms will experience some stresses. You will likely see the word load a lot when doing FEA.

