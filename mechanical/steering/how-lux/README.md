# How Lux?

comprehensive guide of how we designed Lux's steering system, picking rack ratio, steering ratio, how we went from picking parameters to designing parts, manufacturing, aligning

### Project Description and Goal

The steering system consists of a steering wheel, connected to the **Steering Column,** which transfers the rotational motion of the driver input down towards the wheels. The column is then connected to the **Steering** **Rack**, which transfers the rotational input into linear motion in a specific gear ratio. The Rack then connects to **steering bars** with only one degree of freedom, which push on the **Tie Rods**, which have more degrees of freedom. These connect to a **"Steering Hardpoint"** which then connects to the **Tire Upright** (knuckle) to push or pull the wheels, changing the direction of the car.&#x20;

The main goal for our steering system is to maximize efficiency by eliminating scrub. This will be achieved by eliminating bump steer and implementing ackermann steering.



### Project Requirements

\


| Project Requirements         | Priority          | Requirement Description                                                                                                                                                  | Notes/Comments                                                                         | Metric                                    |
| ---------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| Eliminate bump steer         | <p>High<br></p>   | The tie rod and hardpoint system must maintain an instant center as close as possible to the FVSA IC of the suspension (See Hardpoints discussion within dynamics pages) | Not only does this affect Driver experience, but also efficiency and tire wear.        | Qualitative                               |
| Effective Ackermann Geometry | <p>Medium<br></p> | Each "steering hardpoint" must have optimal size/offset from the upright in order to achieve ideal ackermann steering.                                                   | The precise geometry must be determined from the desired turning radius and wheelbase. | Quantitative steering/tire angle analysis |
| Eliminate "Slop"             | <p>Medium<br></p> | Fittings should be tight, yet designed-for-assembly                                                                                                                      | Need effective tolerancing and manufacturing processes                                 | Qualitative                               |



### Steering Technical Overview

<figure><img src="https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-7-12_14-54-54.png" alt=""><figcaption></figcaption></figure>

<figure><img src="https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-7-12_14-58-39.png" alt=""><figcaption></figcaption></figure>

_Application to Lux:_ Steering Ratio should be \~16-18:1



<figure><img src="https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-7-12_15-2-44.png" alt=""><figcaption></figcaption></figure>

_Note: In the above, steering arm refers to the Multi Degree of Freedom "Tie Rod" referenced in_ The Winning Solar Car

_Application to Lux:_

* Apollo's "c-factor" was \~4, which was reasonable for us. Apollo effective steering ratio was approximately \~12:1.
* Our "steering arm length", or tie rod length, will be about \~8.5 inches, =/- 1 inch.
  * Using this assumption, our ideal c-factor is about 3.5 inches - but variation does not have massive effects. Anything from 3-4.5 would do.

### Upright

The **Upright** is a part that serves as an interface between the wheel hub, ball joints, and the steering hardpoint. It will interface with the steering hardpoint in order to rotate the wheel assembly around the kingping axis (balljoints), turning the car.

### Steering Rack

The **Steering Rack** translates driver rotational input to linear "pushing" of the wheels to turn the car. OTS Part.

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

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux\_Mechanical/Lux\_Dynamics/Steering/image-2023-7-12\_15-8-35.png)![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux\_Mechanical/Lux\_Dynamics/Steering/image-2023-7-12\_15-8-49.png)

<figure><img src="https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux_Mechanical/Lux_Dynamics/Steering/image-2023-8-13_17-53-27.png" alt=""><figcaption></figcaption></figure>



### Ackermann Geometry

_When turning, the radius of the turn will vary by wheel. To account for this, each tire should turn at a slightly different angle than its counterpart on the other side in order to prevent scrubbing (think of this as dragging) across the road._

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux\_Mechanical/Lux\_Dynamics/Steering/image-2023-7-29\_13-58-56.png)

_The geometry of Ackermann steering_ (Carroll, ch 9)

(Upside Down)

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux\_Mechanical/Lux\_Dynamics/Steering/Ackerman\_Steering\_Linkage.gif)

_Depiction of Ackermann steering prinicple in motion. NOTE: This is not what actual implementation of geometry should look like. The steering bar must be constrained to move linearly._

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux\_Mechanical/Lux\_Dynamics/Steering/image-2023-9-23\_13-55-37.png)

_Proper angle relation for 10 degree inside turn._&#x20;

_**For Lux:** Outside wheel angle = arctan (2 meters / (2 \* csc(10deg) + 1.1) meters) = 9.007 deg \~ **9 degrees**_

#### Turning Radius

To pass ASC spec, we need to pass the figure-8 test.

![](https://wiki.itap.purdue.edu/download/attachments/258474330/image-2023-4-22\_9-41-21.png?version=1\&modificationDate=1682170881000\&api=v2)

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


![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux\_Mechanical/Lux\_Dynamics/Steering/image-2023-9-27\_23-50-53.png)

_"A reasonable approximation to this geometry may be made as shown in Figure 19.3 ... A good approximation of 'Perfect Ackermann' will be achieved" - Milliken, Ch. 19_

_**For Lux:** This is the first iteration that needs to be designed for. Also, this looks exactly like a 3 wheel car triangle..._

\


_For more resources on determining proper geometry: see Pages 271-273 of The Winning Solar Car and chapter 19 of Race Car Vehicle Dynamics_

\


#### Lux Geometry - The Steering Hardpoint

Exploration of this topic can be found in the [Hard Points](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/SitePages/Lux/Lux\_Mechanical/Lux\_Dynamics/Hard%20Points/Hard%20Points.aspx) page.



Sources:

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

![](https://purdue0.sharepoint.com/sites/PurdueSolarRacing/Shared%20Documents/Lux/Lux\_Mechanical/Lux\_Dynamics/Steering/image-2023-11-3\_17-1-50.png)

