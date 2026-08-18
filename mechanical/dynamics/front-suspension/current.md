---
description: >-
  Detailed description of current (Artemis) front suspension [will insert tons
  of pictures eventually, also chose to bold component names where the most info
  about them appears]
---

# Current

Artemis has double wishbone front suspension with a pushrod, mounted on either side of the chassis, with the shock placed on a big chamfer on either side of the chassis.

### Control Arms

<div><figure><img src="../../../.gitbook/assets/artemis just wishbones.png" alt="" width="313"><figcaption><p>on Artemis</p></figcaption></figure> <figure><img src="../../../.gitbook/assets/standard car double wishbone.jpg" alt="" width="188"><figcaption><p>on commercial cars</p></figcaption></figure> <figure><img src="../../../.gitbook/assets/wishbone bone with hands.jpg" alt="" width="375"><figcaption><p>on turkeys</p></figcaption></figure></div>

Control arms are otherwise known as A-arms or wishbones. The name double wishbone comes from having two of these arms for each wheel.

* **upper control arm** consists of two carbon rods, their inserts and rod ends, and the upper wishbone joint
  * carbon rods are bought from Rockwest Composites and are hollow tubes of layered carbon fiber - they are unidirectional so as to be strong in bending and in compression
  * the carbon rods are simple tubes which need inserts epoxied into them in order to fasten to other parts - these are aluminum cylinders that fit inside the tube, with a lip on the outside and a threaded hole through which a rod end can fit, and a hole through the sides to stick a spring pin through
  * **rod ends** are hardware, with a threaded rod on one end and a ball in a socket that allows a bolt or similar to rotate within a certain range of motion
  * the **upper wishbone joint** has a built in bracket where a carbon rod fits in so that the control arm's angle can be adjusted
    * it also has a swivel joint (like the ball in socket of a rod end) that is bolted through to the upright, with a specific range of motion that will help determine max bump
    * it has a built-in cylindrical insert that allows the second carbon rod to be epoxied directly on
* **lower control arm** consists of one carbon rod and one aluminum triangular part (named lower wishbone fore) that replaces the fore carbon rod
  * inserts and rod ends are similar to upper control arm's
  * the **fore lower wishbone** is aluminum in order to take on more of the bending stresses that carbon rods tend to be vulnerable to
    * the pushrod is bolted through a built-in bracket on the lower wishbone
    * it has a slightly bigger swivel joint than the upper wishbone joint and is bolted through to the bottom of the upright
    * similar built-in cylindrical insert for epoxied carbon rod, as well as a threaded hole to put a rod end into

\[concerned whether it's too assembly-focused like does anyone actually care about inserts?]

### Hardpoints

The control arms are attached to the chassis with 4 **hardpoint brackets on** each side of the chassis. The control arms have rod ends at their extremities, which fit into the brackets and are bolted through with shoulder bolts - this way the control arms have a range of motion with respect to the chassis. The brackets themselves are both epoxied to and bolted through the face of the chassis. \[notes about how the postion of the hardpoints changes the geometry, like the pitch center iirc]

### Upright

The **upright** is where all 6 linkages on the front suspension come together. The fore and aft of both the upper and lower control arms meet at swivel joints bolted into the upper and lower parts of the upright. The steering tie rod also bolts onto a part of the upright that sticks out, which gets pushed and pulled in order to turn the wheel. Lastly, the carbon pushrod \[ermm actually idk about this because it's mounted on the lower wishbone but we consider it when doing calculations in sus solver?? i don't get why it works]

The upright has a big bore in the center where it integrates with the hub and spindle \[UH OH hubs and spindles mentioned.... needs its own page or entire section of pages] assembly, allowing the wheel to spin while staying attached to the suspension.

Additionally, the upright has a tab built into it where the brake caliper will mount, and from there the caliper pinches the brake rotor to stop the wheels from spinning.

\[also decides the kpi? or am i wrong]

Because of all these parts rotating and interacting with the upright at angles, it is a pretty complex part to manufacture - more about this in [Manufacturing and Assembly](https://app.gitbook.com/o/VgqQpOyMtIqpSG170vlO/sites/site_Ly1Ao/s/UuRMvpyeM6qdlkjmzeYV/~/edit/~/changes/179/mechanical/dynamics/front-suspension/artemis/manufacturing).

### Pushrod

A pushrod is an alternative to the common way of mounting a shock to double wishbone suspension, which would be to attach one end of the shock to the upright and the other end directly to the chassis. Formula SAE often uses pushrods instead, for reasons elaborated on in [Designing](https://app.gitbook.com/o/VgqQpOyMtIqpSG170vlO/sites/site_Ly1Ao/s/UuRMvpyeM6qdlkjmzeYV/~/edit/~/changes/179/mechanical/dynamics/front-suspension/artemis/designing).&#x20;

The **pushrod** itself is a carbon rod, longer than the control arm rods, which mounts to the aluminum lower wishbone on one end and to the triangular **rocker** on the other. The rocker has specific sidelengths so as to have a desired motion ratio, where moving the pushrod by some amount will move the shock by a proportional amount. The rocker rotates about one of its corners, which is bolted to the chassis sitting atop a frustum. The **frustum** distributes force from the small area where the rocker makes contact with it to the larger area where it is bolted and epoxied into the chassis.

On the last corner of the rocker is where the **shock** is bolted. Shocks, otherwise known as shock absorbers or dampers, are often coilover shocks with a large spring. The shocks we use are gas shocks, so instead of using spring force to absorb energy from bumps, they use nitrogen-infused hydraulics \[that might be total bs please correct it if so]. The other end of the shock is bolted into the **shock mount**, which is in turn bolted to the chassis.
