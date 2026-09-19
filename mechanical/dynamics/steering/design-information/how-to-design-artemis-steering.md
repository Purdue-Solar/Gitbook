# How to Design Artemis Steering

This guide outlines how to design the initial Artemis steering geometry.

#### Steering Design Philosphy

* Your goal is to enable the driver to steer the car efficiently and safely
* The steering system allows the driver to point the wheels where they want to go
* Do not design components with a safety factor of 1.01
* "The suspension and chassis components are highly important for the safety and performance of the car. Failure in the suspension or chassis will often make the car go out of control, so it is very important that these components do not fail. It is tempting for the mechanical engineer to design these components to the limit of the strength of the material to minimize their weight. Keeping the weight under control is extremely important for solar cars, but it is not good design philosophy to design chassis and suspension components near their limit for any vehicle, including solar cars." - Carroll

#### Useful Resources

[Mechanical Research Resources](https://drive.google.com/drive/folders/1vU1J4XkArJGjJIHKo-9O4Q6CHOohSoUo) (Google drive link)

* _Race Car Vehicle Dynamics_ (Milliken & Milliken)
* _The Winning Solar Car_ (Carroll)

#### Required Reading

Please read the following chapters before designing a solar car steering system

* _Race Car Vehicle Dynamics_, Chapter 19 (Steering Systems)
* _The Winning Solar Car_, pages 259-275 (Front-End Geometry and Steering)
  * You don't need to do the homework problems at the end

#### Steering Priorities

1. Maximize Ackerman steering
2. Minimize bump steer
3. Achieve sufficient turning radius to pass dynamic scrutineering
4. Reduce slop and backlash

#### Initial Assumptions

_These are things you want to have before starting the steering design._

* Is the steering rack on the top or bottom of the chassis? Rack was on the chassis floor for Artemis and Lux.
* Front suspension geometry and hardpoints are set. For Artemis, I began the steering design with finalized hardpoints for the double wishbone front suspension.
* Wireframe model containing wheel locations, front suspension hardpoints, wishbone lengths, and kingpin axis

<div align="left"><figure><img src="../../../../.gitbook/assets/image (103) (1).png" alt="" width="382"><figcaption><p>The front suspension wireframe model should look something like this.</p></figcaption></figure></div>

#### Priority 1: How to Design for Ackermann Steering

A reasonable approximation for Ackerman geometry can be found in Fig 19.2 of _Race Car Vehicle Dynamics_ or Fig 9.16 in _The Winning Solar Car_. To achieve Ackermann steering, refer to the following steps:

1. Orient to a top-down view of the car (X-Y plane for Artemis)
2. Draw a line connecting the center of the rear wheel to the kingpin axis

The steering knuckle (the point where the tie rod connects to the upright) should lie on this line to achieve Ackermann steering. For the steering knuckle, pick an approximate point that satisifies the follow criteria:

1. Lies on the line connecting the rear wheel and kingpin axis
2. Lies on the same side of the kingping axis as the steering rack (See Fig 9.16)
3. The knuckle point can realistically attached to the upright
4. Avoid interferences with the upright, wheel, hubs, and brakes

<div align="left"><figure><img src="../../../../.gitbook/assets/image (106) (1).png" alt="" width="563"><figcaption></figcaption></figure></div>

<div align="left"><figure><img src="../../../../.gitbook/assets/image (108) (1).png" alt="" width="536"><figcaption></figcaption></figure></div>

Sketch from Artemis design:

<div align="left"><figure><img src="../../../../.gitbook/assets/image (105) (1).png" alt="" width="246"><figcaption></figcaption></figure></div>

#### Priority 1: How to Minimize Bump Steer

Now that we've found the location of the steering knuckle point in the top view (X-Y plane for Artemis), let's minimize bump steer while finding the location of the steering knuckle point in the front view. To minimize bump steer, refer to the following steps:

1. Orient to a front view of the car (Y-Z plane for Artemis)









## How to Minimize Bump Steer

Refer to figure 19.7 in Race Car Vehicle Dynamics

<div align="left"><figure><img src="../../../../.gitbook/assets/image (107) (1).png" alt="" width="563"><figcaption></figcaption></figure></div>

How to achieve this geometry:

* Orient to a front view of the car
* Project the point you just chose for Ackermann steering to get your size-to-side geometry
* Pick a realistic point&#x20;
* The tie rod must intersect the location where the upper and lower wishbone connect in the middle (roll center?)
* Move wireframe model of the upright and wishbones up and down. The steering knuckle point will trace out a circular path
* The inboard point of the tie rod (where the tie rod attaches to the steering rack) will align to the point on the rack where&#x20;
* Tie rod must remain at specific angle!
