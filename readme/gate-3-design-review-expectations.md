---
description: Gate 3 DR Expectations To Follow
---

# Gate 3 Design Review Expectations

## Intro Slideshow

* Have a general overview of the car, what it looks like, where all the systems are located
* Main constraints of car and purpose of the car
* Systems and schedule for presentation

## General Requirements

* Have a general system overview, this means one for Mechanical, Electrical, and Composites, with CAD/block diagrams of the systems to explain how they work together, make sure the audience can understand this
  * Each team should have ONE slideshow, so electrical should have one big slideshow, mechanical has one big slideshow, and composites has one big slideshow
  * This will help have one general overview of the entire system so that it makes sense to the viewers for each system
*   Have a picture which is located in the top right of your slides that shows where you are currently located in the CAD with a box

    * Box moves as you look through the CAD



    <figure><img src="../.gitbook/assets/image (2).png" alt=""><figcaption><p>Example of general overview with box</p></figcaption></figure>
* Have everything in CAD in it's final form, shown in the slideshow
* All FEA and any types of load analysis done and shown
* All parts adhere to rules fully and are shown that they do in the slideshow
* Interactions with other subsystems, how they integrate with each other and where
* Final System Weights, Bounding Boxes, and Materials Selected
* How issues from Lux are solved with this new system
* General manufacturing plans, making sure they are manufacturable, and general timelines for manufacturing

## Mechanical

#### Suspension

* Front suspension and rear suspensions designs in CAD
* Show all parts that are used and why they are chosen
* Final hardpoint locations
* FEA on all parts, all other calculations shown on how they have been derived and why they prove that the system is safe
* Show calculations for stability of vehicle and dynamics
* Safety factors and rule applications

#### Brakes

* Show all CAD
* Show all parts that are used and why they are chosen
* Mounting points on chassis and wheels
* Show that the hand brake will actually work and why that design was chosen
* FEA on all parts, show all calculations for braking loads
* Safety factors and rule applications

#### Steering

* Show all CAD
* All parts that are purchased and why they are chosen
* Mounting points on chassis and wheels and steering type
* FEA on parts and explain how wiggle will be solved in new design
* Safety factors and rule applications

#### Interiors

* Show all the CAD and integration with other systems
* All parts that are used and why they were chosen
* Mounting points and human factor considered
* FEA on necessary parts, show how the top shell supports are working
* Safety factors and rule applications

## Composites

#### Aeroshell

* Show the aeroshell outline/design?
* Show application to rules

#### Chassis

* Show all CAD and driver sizing constraints from rules
* Show all FEA and explain materials and selective thicknesses
* Mounting points with other systems
* Safety factors and rule applications for chassis

#### Top-Shell and Chassis Supports

* Show all FEA to prove stability
* Methods behind why they were designed the way they are
* How to bond to the topshell and chassis and bottom shell
* Material selection
* Interfacing between bottom and top-shell interaction
* Show application to rules and safety factor

#### Battery Box

* Show CAD of both battery boxes
* Cooling solution for main battery
* Material selection for the boxes
* How to attach to the chassis for both boxes
* Show application to the rules
* How to remove the main battery from the back of the chassis

## Electrical

#### Solar

* Show CAD and sizing of the systems
* Explain how power is transferred to the other systems
* Show output voltages and general electrical specs of the system
* Show corresponding rules for the system

#### High Voltage

* Show the CAD for the battery arrangement
* Show schematics of PCBs, highlighting electronic parts and explaining how these parts will work for the system
* Show voltages and other electrical specs of the system
* Consider heat dissipation, safety, redundancy
* Show rule applications

#### Low Voltage

* Show the CAD of the low voltage systems
* Show the schematics of the PCBs and how they integrate with the general systems
* Show how power is split up into parts to the different systems
* Consider heat dissipation, safety, redundancy
* Show the rules that apply to the systems

#### Embedded Systems

* Show the CADs of the systems
* Explain the schematics of the PCBs and how they will integrate with other systems and make things work
* Consider human factor for displays, integration with interiors
* Show rules that correspond with the systems

## Strategy

* Share strategy for Artemis
* Average speeds and prediction algorithms for future conditions, etc
