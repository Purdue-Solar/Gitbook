---
icon: jenkins
cover: >-
  https://images.unsplash.com/photo-1581985673473-0784a7a44e39?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxOTcwMjR8MHwxfHNlYXJjaHwxMHx8d2hpdGUlMjBwaW5rJTIwYmx1ZXxlbnwwfHx8fDE3ODkyNjY3NTN8MA&ixlib=rb-4.1.0&q=85
coverY: 0
coverHeight: 356
layout:
  width: default
  cover:
    visible: true
    size: background
    mask: radial
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
  tags:
    visible: true
  actions:
    visible: true
---

# BEST DESIGN PRACTICES

### So generally for solar vehicles we want:

* <mark style="color:$warning;">**100% Ackerman**</mark>
* <mark style="color:$tint;">**Small Scrub Radius**</mark>&#x20;
* **Zero Static Camber**
* <mark style="color:cyan;">**Negative Camber Gain**</mark>
* <mark style="color:blue;">**Positive Caster Angle**</mark>
* <mark style="color:pink;">**Zero bump steer**</mark>
* <mark style="color:violet;">**Positive KPI**</mark>

### A Review on why we want said things:

#### <mark style="color:$warning;">100% Ackerman Steering:</mark>

<img src="../../../../.gitbook/assets/unknown (31).png" alt="" width="164">

Ideal for reducing tire scrub and increasing cornering efficiency

#### <mark style="color:$tint;">Small Scrub Radius</mark>&#x20;

A large scrub radius increases the lateral grip between the tire contact patch and the road surface which makes steering more difficult and decreases cornering efficiency. Minimizing the scrub radius is key to making steering easier, however, a scrub radius of zero can decrease the feedback the driver gets while cornering and increase instability when cornering. A small negative scrub radius is ideal since it still allows the driver to have feedback while cornering with the added benefit of increasing stability during breaking by causing the one of the front tires to toe out if the other loses traction.&#x20;

<div><img src="../../../../.gitbook/assets/unknown (30).png" alt="Negative Scrub Radius" height="225" width="226"> <figure><img src="../../../../.gitbook/assets/image (101).png" alt="" width="255"><figcaption><p>Very Large Positive Scrub Radius</p></figcaption></figure></div>

#### Zero Static Camber

Static camber doesn't really help us too much since it can lead to uneven tire wear while driving straight. Camber is much more beneficial during cornering which is why it's ideal to design a system for camber gain.&#x20;

<img src="../../../../.gitbook/assets/unknown (32).png" alt="BIG ole static camber" height="234" width="341">

#### <mark style="color:cyan;">Negative Camber Gain</mark>

Negative camber gain during cornering is ideal to reducing uneven tire wear and to increase cornering efficiency.&#x20;

<div><img src="../../../../.gitbook/assets/unknown (25).png" alt="NO CAMBER: Left - Driving Straight, Right - Cornering " width="311"> <img src="../../../../.gitbook/assets/unknown (26).png" alt="CAMBER: Left -  Driving Straight, Right, Cornering" width="334"></div>

<div><img src="../../../../.gitbook/assets/unknown (27).png" alt="Uneven tire wear as a result of not having enough camber" width="375"> <figure><img src="../../../../.gitbook/assets/unknown (29).png" alt="" width="375"><figcaption><p>Camber Gain During Bump</p></figcaption></figure></div>

Negative camber creates camber thrust in the direction of the turn, which makes cornering easier.<br>

#### <mark style="color:blue;">Positive Caster Angle</mark>

<figure><img src="../../../../.gitbook/assets/image (102).png" alt=""><figcaption></figcaption></figure>

A positive caster angle creates negative camber gain!

#### <mark style="color:pink;">Zero Bump Steer</mark>

Bump steer occurs when a bump moves the wheel in a path inconsistent with the tie rod's path, creating unwanted relative motion (seen as toe in/out) between the wheels and the chassis. We want to avoid this as much as possible! We can avoid bump steer by aligning the tie rods with the front view instant center (the intersection point between the vectors formed by the upper and lower control arms).

<img src="../../../../.gitbook/assets/unknown (33).png" alt="Top Linkage = Upper control arm, Middle Linkage = tie rod, Bottom Linkage = Lower control arm" width="563">

#### <mark style="color:violet;">Positive KPI</mark>

A positive kingpin inclination is ideal for reducing the scrub radius and producing zero static camber.

## oh no oh no they gave me a part to design what do i do???

omg that's so scary im so sorry to hear that

you don't have to do all of these btw, these are just some guidelines to follow! I know it might be scary being given responsibility but you're so capable I believe in you RAGHHHH

{% stepper %}
{% step %}
### Figure out what the part is for!

Ask your lead, reference the model or any other known sources of documentation
{% endstep %}

{% step %}
### Find out what the constraints are!

* What are known unmoveable objects around where the part is? What 100% cannot change? What are the dimensions surrounding the part? if it's a connecty piece how long/wide will it have to be?
{% endstep %}

{% step %}
### Choose hardware/ make a plan for how the part will connect to other parts

* reference known standards like the BOM or other known assemblies, this will help you figure out hole sizes, thread count, etc
{% endstep %}

{% step %}
### Draw a basic sketch of the part to plan out geometries, also to give your lead a chance to point out any massive glaring issues (will make next part easier)

* make sure to include dimensions / multiple views or at least the most important view witj the most applicable constaints visible&#x20;
{% endstep %}

{% step %}
### Know manufacturing processes/ where this part will be made

* What machine will I use (at BIDC)?
  * &#x20;Generally for more simple parts you can do them on the manual mill (stuff like blocks with holes in them )&#x20;
  * For things with more complex geometry (fillets, step downs on varying size, ramps that go down in multiple angles, large bores etc.) they'll have to be CNC'd on either the VF2 or the VF4
  * For stuff thats even more complex you might have to use the five axis (ooh scary)
* Additional questions to ask yourself:
  * Are the gaps/ holes in your part machineable? is the gap that you made too deep for the only available mill of a certain size?
  * Do they have drills available for the kinds of holes you want to make?
{% endstep %}
{% endstepper %}
