---
icon: ruler-triangle
cover: >-
  https://images.unsplash.com/photo-1707046024830-d503f94f4311?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxOTcwMjR8MHwxfHNlYXJjaHw1fHxncmVlbiUyMGZsb3dlcnN8ZW58MHx8fHwxNzg5MjU2MTMwfDA&ixlib=rb-4.1.0&q=85
coverY: 0
coverHeight: 353
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

# Parallel, Ackerman, and Anti-Ackerman

#### What affects steering geometry?

* Front Tire Slip Angles
* Tie Rod Length
* Tie Rod Angle&#x20;

<img src="../../../../.gitbook/assets/unknown (13).png" alt="" height="292" width="624">

#### Ackerman Steering

A steering geometry where the tire on the inside of the vehicles turning radius turns at a higher rate than the outer wheel. This relationship depends on the ratio of the slip angles between the front tires and the wheel base:

<figure><img src="../../../../.gitbook/assets/image (100).png" alt=""><figcaption><p>Ackerman = arctan (wheelbase/((wheelbase/tangent(outside slip angle) - track length from the front)</p></figcaption></figure>

Ackerman steering geometry is ideal since it produces a minimal amount of scrub against the ground which reduces tire wear and increases cornering efficiency.&#x20;

<img src="../../../../.gitbook/assets/unknown (14).png" alt="" height="227" width="199">

Aligning the angle of the tie rods to the center of the rear wheel axel is another way some people create Ackerman angles. Ackerman geometry is best for application where the vechicle typically reaches between 30-70 mph.&#x20;

#### Parallel Steering

Parallel steering is a steering geometry in which the front wheels turn at the same rate so they remain parallel during cornering. This isn't necessarily the best kind of steering geometry since it creates a ton of tire scrub and is less efficient then other steering geometries.

#### Reverse Ackerman Steering Geometry

A steering geometry where the outside wheel turns at a higher rate than the inside wheel. This is ideal for higher speed applications like F1 racing.&#x20;
