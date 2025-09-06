---
description: >-
  A comprehensive guide of how we Lux's steering was created: rack ratio,
  steering ratio, translating parameters to design, manufacturing, alignment,
  and more.
---

# Lux Steering Retrospective

### Project Description

The steering system consists of a **Steering Wheel,** connected to the **Steering Column,** which transfers the rotational motion of the driver input down towards the wheels. The column is connected to the **Steering** **Rack**, which transfers the rotational input into linear motion at a specific gear ratio. The rack then pushes on the **Tie Rods**, which have multiple degrees of freedom to produce Ackermann Steering. These connect to a rigid **Steering Hardpoint** which then connects to the **Tire Upright** push or pull the wheels, changing the direction of the car.

### Goals

The main goal for our steering system is to maximize efficiency by eliminating scrub. This will be achieved by 1) eliminating bump steer and 2) implementing Ackermann steering.

### Project Requirements

<table><thead><tr><th width="151">Requirements</th><th width="80">Priority</th><th width="250">Requirement Description</th><th>Notes/Comments</th><th>Metric</th></tr></thead><tbody><tr><td>Eliminate bump steer</td><td>High<br></td><td>The tie rod and hardpoint system must maintain an instant center as close as possible to the FVSA IC of the suspension (See Hardpoints discussion within dynamics pages)</td><td>Not only does this affect Driver experience, but also efficiency and tire wear.</td><td>Qualitative</td></tr><tr><td>Effective Ackermann Geometry</td><td>Medium<br></td><td>Each "steering hardpoint" must have optimal size/offset from the upright in order to achieve ideal Ackermann steering.</td><td>The precise geometry must be determined from the desired turning radius and wheelbase.</td><td>Quantitative steering/tire angle analysis</td></tr><tr><td>Eliminate "Slop"</td><td>Medium<br></td><td>Fittings should be tight, yet designed-for-assembly</td><td>Need effective tolerancing and manufacturing processes</td><td>Qualitative</td></tr></tbody></table>



### Steering Technical Overview

The following italicized notes comes from Race Car Vehicle Dynamics:

_**Steering Gears**_

_The steering rack or steering box translates rotary motion of the steering wheel to linear motion at the tie rods. In turn, the tie rods translate this linear motion back to rotary motion about the kingpin axis (steering axis) resulting in steer of the front wheels._

_The first thing that should be obvious is that there are a lot of connections in the steering system. All of these connections are a source of compliance (bending or deflecting) or lost motion (looseness or slop), any of which will make the steering imprecise—the driver will not know exactly in which direction the front wheels are aimed. The steering system components must all be tight and mounted securely for both safety and control._

_**Steering Ratio**_

_The overall steering ratio is defined as degrees of steering wheel angle divided by corresponding front wheel angle. For race cars it varies from over 20:1 (slow) for Superspeedway cars to less than 10:1 (very fast) for Formula One cars on tight street circuits. Of course, the ultimate in fast steering is the go-kart with nearly 1:1. Common values in road racing are 16:1 to 18:1. With Ackermann (or reverse Ackermann) geometry, the steering ratio will be different side to side. Depending on the linkage configuration the steering may be nonlinear, that is, the ratio may vary with wheel angle._

Lux was designed for road racing with low speed (<40 mph) cornering. Based on this, the steering ratio should be around 18:1.



From Race Car Vehicle Dynamics:

_**Rack-and-Pinion Steering Box Ratio**_

_Rack-and-pinion gearsets convert rotary motion at the steering wheel to linear motion at the inner tie rod ball joint. The steering ratio is calculated using the rack c-factor and the steering arm length (as measured from the outer ball joint to the kingpin axis)._

_c-factor = travel (in.) / 360° pinion rotation_

_Often, a steering rack will be described as a “1-7/8-inch rack” or a “2-inch rack”; this dimension is the amount the rack moves for one rotation of the steering wheel—the c-factor._

_Once the c-factor is known for the rack, the steering ratio can be calculated approximately by:_

_**Steer ratio** = sin⁻¹(c-factor / steering arm length) / 360_

_Where:_

* _Dimensions are in inches._
* _Angles are in degrees._
* _sin⁻¹ is the same as “the angle with sine of,” or arcsin._

_The approximation will be good as long as the angularity in the system is minimal, that is, the tie rod is nearly perpendicular to the steering arm in top and front view. For designs with high angularity, a layout is required to determine the steering ratio._

_Note: In the above, steering arm refers to the Multi Degree of Freedom "Tie Rod" referenced in_ The Winning Solar Car

_Application to Lux:_

* Apollo's "c-factor" was \~4, which was reasonable for us. Apollo effective steering ratio was approximately \~12:1.
* Our "steering arm length", or tie rod length, will be about \~8.5 inches, =/- 1 inch.
  * Using this assumption, our ideal c-factor is about 3.5 inches - but variation does not have massive effects. Anything from 3-4.5 would do.

### Upright

The **Upright** is a part that serves as an interface between the wheel hub, ball joints, and the steering hardpoint. It will interface with the steering hardpoint in order to rotate the wheel assembly around the kingping axis (balljoints), turning the car.

### Steering Rack

The **Steering Rack** translates driver rotational input to linear "pushing" of the wheels to turn the car. COTS Part.

**Chassis Consideration:** Chassis wall-wall length is 20 inches. Need to account for 2.5+ in of travel in steering rack. Therefore rack (+extensions) needs to be \~27 inches total.

* [**https://fsaeparts.com/products/narrco-racks?variant=15279234220075**](https://fsaeparts.com/products/narrco-racks?variant=15279234220075)

Potentially a solid option. Right ratio.

* [\*\*\*https://www.kaztechnologies.com/steering-rack](https://www.kaztechnologies.com/steering-rack)

Too low of a steering ratio (4.75 in/rev)

BUT might be adjustable enough for our purposes to overcome chassis issues.



## Efficiency Issues

**Scrubbing** is any movement of the contact patch on the road that is not rolling. This absorbs lots of energy from the car, reducing efficiency and wearing on the tires.

### Bump Steer

_Bump steer occurs when a bump moves the wheel in a path inconsistent with the tie rod's path, creating unwanted relative motion (seen as toe in/out) between the wheels and the chassis._

The tie rods must be adjustable in length in order tune out bump steer. (pg 724, Milliken) However, it is even more important to properly place the tie rod hardpoint to properly locate the IC.

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-7-12_15-8-35.png)![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-7-12_15-8-49.png)

<figure><img src="https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-8-13_17-53-27.png" alt=""><figcaption></figcaption></figure>



### Ackermann Geometry

_When turning, the radius of the turn will vary by wheel. To account for this, each tire should turn at a slightly different angle than its counterpart on the other side in order to prevent scrubbing (think of this as dragging) across the road._

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-7-29_13-58-56.png)

_The geometry of Ackermann steering_ (Carroll, ch 9)

(Upside Down)

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/Ackerman_Steering_Linkage.gif)

_Depiction of Ackermann steering principle in motion. NOTE: This is not what actual implementation of geometry should look like. The steering bar must be constrained to move linearly._

<figure><img src="https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-9-23_13-55-37.png" alt="" width="375"><figcaption></figcaption></figure>

_Proper angle relation for 10 degree inside turn._&#x20;

_**For Lux:** Outside wheel angle = arctan (2 meters / (2 \* csc(10deg) + 1.1) meters) = 9.007 deg \~ **9 degrees**_

#### Turning Radius

To pass ASC spec, we need to pass the figure-8 test.

**Figure-8**&#x20;

* Car must go through a Figure-8 course iturn less than 8 seconds per side. Can't knock over cones&#x20;
* Course is 5 meters wide&#x20;
* Circles are 6 meters radius

This means that the Minimum turning radius is equal to:    6 + (5/2) = 8.5 m

The turning radius formula is:

**TR = WB / (Tan(theta))**

Wb - wheelbase (2m for Lux)

theta - Max angle of tire (18+ degrees inside, 15.7 degrees outside, average: 16.85 deg)

2/ tan(16.85) = 6.6 m

Required angle to complete this test: atan(1/3) = 13.24 deg

\


![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-9-27_23-50-53.png)

_"A reasonable approximation to this geometry may be made as shown in Figure 19.3 ... A good approximation of 'Perfect Ackermann' will be achieved" - Milliken, Ch. 19_

_**For Lux:** This is the first iteration that needs to be designed for. Also, this looks exactly like a 3 wheel car triangle..._

\


_For more resources on determining proper geometry: see Pages 271-273 of The Winning Solar Car and chapter 19 of Race Car Vehicle Dynamics_

\


#### Lux Geometry - The Steering Hardpoint

Exploration of this topic can be found in the [Hard Points](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/SitePages/Lux/Lux_Mechanical/Lux_Dynamics/Hard%20Points/Hard%20Points.aspx) page.



**Sources:**

_Race Car Vehicle Dynamics, Chapter 19, Milliken (Warning: Although extremely useful, this book is often aimed at cars racing in much different conditions than we are. Use caution when evaluating "recommendations")_

_The Winning Solar Car, Chapter 9, Carrol (Less in depth, but aimed at solar cars.)_

\


this is just a spacer

## Design Summary

Lux CAD weight: 2.72 lbs

Rack Length: 23 in

Tie Rod Length: 8.525 in (eye to eye)

"Ackermann" length: 3.663

Rack/TR rest angle: 3.8 degrees

DtoK: .763 in

Expected steering rack travel: 1.25 in each

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-11-3_17-1-50.png)

