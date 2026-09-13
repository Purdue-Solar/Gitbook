---
icon: lungs
cover: >-
  https://images.unsplash.com/photo-1507471509451-1d04d60f896d?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxOTcwMjR8MHwxfHNlYXJjaHwzfHxyZWQlMjBmbG93ZXJzfGVufDB8fHx8MTc4OTI1NjA5Mnww&ixlib=rb-4.1.0&q=85
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

# Steering Anatomy

### **What parts are in a steering system?**

<figure><img src="../../../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

* <mark style="color:$danger;">**RED: Steering Wheel**</mark>
* <mark style="color:$warning;">**ORANGE: Gearbox (not every system has this)**</mark>
* <mark style="color:$success;">**GREEN: Tie Rods**</mark>
* <mark style="color:cyan;">**BLUE: Steering Column**</mark>
* <mark style="color:purple;">**PURPLE: Steering Rack**</mark>

#### **What does each part do?**

**Steering Wheel:**

<img src="../../../../.gitbook/assets/unknown (2).png" alt="Upper Steering Assembly Artemis prior to May 2026" height="162" width="314">

Transfers driver input to rotational energy.&#x20;

**Gearbox**

<div><img src="../../../../.gitbook/assets/unknown (3).png" alt="Upper Steering Assembly Artemis"> <figure><img src="../../../../.gitbook/assets/image (63).png" alt="" width="308"><figcaption><p>1:1 Bevel Gears</p></figcaption></figure> <figure><img src="../../../../.gitbook/assets/Screenshot 2026-09-03 161345.png" alt=""><figcaption><p>Lux U-joint Connections</p></figcaption></figure></div>

For Artemis we used a 90 degree gearbox with bevel gears to translate the motion from the steering wheel to the steering column. This was done to make integration with the Composites team easier and to reduce the slop between connections going from the steering wheel to the column we previously experienced while using U-joints. Not every team has this, in fact some teams have connections from the steering wheel directly to the steering column:&#x20;

<figure><img src="../../../../.gitbook/assets/image (9).png" alt=""><figcaption><p>Inside View of Innoptus ASC 2026</p></figcaption></figure>

Using rigid and/or fewer connections is ideal to increase the efficiency of motion transfer between the steering wheel to the rest of the column.

**Tie-rods**

<figure><img src="../../../../.gitbook/assets/image (70).png" alt="" width="331"><figcaption><p>Tie-Rod on Artemis</p></figcaption></figure>

Tie-rods are connected to the car's steering rack and tire hubs, they're used to steer the car's tires to the left and right. The angle and length of the tie-rod changes how the car corners and the amount of feedback the driver receives while driving.

**Steering Column**

<div><figure><img src="../../../../.gitbook/assets/image (78).png" alt=""><figcaption><p>Steering Column Oregon State University ASC 2026</p></figcaption></figure> <figure><img src="../../../../.gitbook/assets/unknown (5).png" alt=""><figcaption><p>Artemis Steering Column</p></figcaption></figure> <figure><img src="../../../../.gitbook/assets/Screenshot 2026-09-03 161345.png" alt=""><figcaption><p>Lux Steering Column</p></figcaption></figure></div>

Steering columns transfer rotation from the steering wheel to the rack.

**Steering Rack**

<div><figure><img src="../../../../.gitbook/assets/image (79).png" alt=""><figcaption><p>Rack and Pinion Gears </p></figcaption></figure> <figure><img src="../../../../.gitbook/assets/unknown (6).png" alt=""><figcaption><p>Artemis Steering Rack</p></figcaption></figure></div>

The steering transfers rotational motion from the steering column to the tie-rods that push the tires to turn them. The column turns the pinion gear which causes the rack to travel to the left and right.&#x20;
