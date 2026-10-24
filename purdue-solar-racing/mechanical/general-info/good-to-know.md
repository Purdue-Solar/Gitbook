---
description: Concepts + quick definitions
icon: head-side-brain
---

# Good to Know

#### Center of Gravity

Also known as center of mass, CG, or CoG. The car has a center of gravity that we design to be in a certain location by placing large weights (battery, driver) along deliberate locations in the car. The CG has 3 coordinates in the 3D Cartesian coordinate system - x, y, and z. X is longitudinal (forward and back of car), Y is lateral (left and right of car), and Z is height (up and down). The CG height is important in weight transfer calculations as well as for the stability of the car overall.&#x20;

#### Track Width & Wheel Base

Track width is the distance between the contact patches of the front wheel (center to center). Wheel base is the distance between the front contact patches and the rear contact patch (center to center). These are two core dimensions that, like CG height, should be decided as part of the design very early on. The ratio between track width and wheelbase has to be near 1:2 (according to the rules!) for stability.

#### Ballast

In the race regulations, drivers across all solar car teams must weigh 80 kg. In order to make this happen, we are required to place a ballast within a short distance of the driver's sitting position. The ballast AKA ballast bag is a bag of (usually) lead pellets that will be heavy enough to bring the driver's weight up to 80 kg.

#### Fore and Aft

Fore refers to the direction towards the front of the car longitudinally. If the driver is sitting looking forward, they are looking fore-wards. Aft is the opposite. We use these terms especially when describing front suspension parts. Additionally, when we refer to the right side and the left side of the car, it is from the driver's perspective.

#### Stock

Stock refers to un-machined material. This might be a cylinder of aluminum, or a chunk of bronze, or a cube of steel, or whatever.

#### Finite Element Analysis

Finite element analysis, or FEA, is a kind of simulation method that allows you to run static stress simulations on CAD modeled parts. Softwares like Ansys or NX will take a CAD model and create a mesh, which models the surface of the part with a lot of tiny geometric shapes (finite elements) that allow it to analyze how the part responds to forces. "FEA" is more or less interchangeable with "stress simulation".

<figure><img src="../../.gitbook/assets/Screenshot 2026-09-12 010823.png" alt="" width="180"><figcaption><p>colorsss</p></figcaption></figure>

At its simplest, running FEA means putting forces on your part in your computer and letting the colors tell you where it will break. This saves oodles of the money and time it would require to physically make parts to see how they break.

#### Loading

In statics, the word "load" pretty much means "force". A lot of our calculations are statics problems in disguise. For suspension to be "fully loaded" means the full weight of the car is resting on it normally, meaning the shock will probably be compressed by some amount, and the control arms will experience some stresses. You will likely see the word load a lot when doing FEA.&#x20;

A "load case" is a specific physical situation where certain loads would be placed on the part. FEA is run for different load cases for the same part - will a bracket break if it gets pulled on really hard? If it is hit from the side? If it's pushed really hard?

#### Safety Factor

Safety factor or factor of safety or SF is a number you pull out of FEA. If you have a part made of aluminum, FEA will tell you the maximum stress the part experiences; take that number and divide it by the yield strength of aluminum (depends on the alloy, for Al 7075 it's 500 MPa): that is your part's safety factor. If SF < 1 for a load case, then the part is going to break ("yield"). For critical parts, we aim for safety factors above 2 - although this may mean heavier parts, it is better safe than sorry.

#### Stiffness vs Strength

Stiffness and strength are different concepts. Stiffness is about rigidity, and strength is resistance to breaking or permanently bending. A rope can be very strong but is not stiff, whereas a glass vase is stiff but can break easily.

#### Stress Patterns

When materials undergo forces, they experience forces over areas, which creates stress patterns throughout the part. You'll learn this in ME 270 (statics) if you're in mechanical engineering, but there are several kinds of stresses according to the direction they act on a part. Depending on a material's properties, it will be more prone to yielding to some kinds of stresses than others. For example, an aluminum rod with a cross-sectional area shaped like an I is likely stronger against bending than a carbon tube of similar dimensions. There is math behind this that is easily learned.

<div><figure><img src="../../.gitbook/assets/Screenshot 2026-09-12 010150.png" alt="" width="563"><figcaption><p>The main kinds of stress patterns</p></figcaption></figure> <figure><img src="../../.gitbook/assets/i beam.jpe" alt="" width="224"><figcaption><p>an I-beam, strong against bending stresses</p></figcaption></figure></div>
