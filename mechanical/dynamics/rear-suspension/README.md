---
description: Overview of rear sussy
icon: tire-pressure-warning
---

# Rear Suspension

In a 3-wheeled bullet, the rear wheel is where the motor pushes the entire car. Because there is only one wheel that must take the load where a normal car would have two, a big goal of rear suspension is to achieve stiffness.

<figure><img src="../../../.gitbook/assets/Screenshot 2026-09-11 212047.png" alt="" width="375"><figcaption><p>Artemis's FSGP 2026 rear suspension assembly 😍😍😍</p></figcaption></figure>

As the car turns, all the lateral forces that would normally be distributed between two rear wheels are concentrated on the single rear wheel, meaning the rear suspension has to have very good torsional (twisting) stiffness to avoid flexing or deforming. If the suspension flexes, the wheel can lose grip with the ground which is obviously dangerous or the tire can scrub, which is inefficient.

#### Designs

The common designs for rear suspension are double wishbone, swingarm, and trailing arm. If you go to a solar car race, you're probably going to see trailing arm rear suspensions more than anything else because they're light and relatively simple.

Double wishbone is what front suspension usually looks like, with two control arms connected to an upright that has the wheel on it. It looks a bit funny on the rear because the control arms are bolted onto the back of the chassis, so the upright has to manage a 90 degree rotation from the control arms to the wheel (compared to front sus). We nearly used double wishbone on Artemis's rear suspension, but decided against it - see [Design](https://app.gitbook.com/o/VgqQpOyMtIqpSG170vlO/sites/site_Ly1Ao/s/UuRMvpyeM6qdlkjmzeYV/~/edit/~/changes/227/mechanical/dynamics/rear-suspension/artemis/design) to know why.

Swingarms are how the back half of motorcycles are attached. The wheel has a big arm that sandwiches either side of it, with an axle going through.&#x20;

#### Compared to Front Sus

Some of front suspension's considerations are shared with rear suspension, but because we avoid using double wishbone in the rear (thus far), the geometry tends to be a lot simpler.

We do still care about:

* weight transfer and forces on linkages - there is a version of the MATLAB suspension solver specifically for the rear
* spring rates - the rear suspension has a shock with a different spring rate from the front
* 0 camber and 0 toe - alignment is still important
* mounting brake calipers

We don't need to worry about:

* integrating the steering into the suspension
* mirroring an entire system
* hub assembly

We get the additional nuances of:

* hub motor 🤤
* torsional stiffness
* more load than a singular front wheel
