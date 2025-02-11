---
description: Specifically for use with the NASTRAN solver
---

# How to not cry while using SimCenter3D

**Prologue**

Anyone can be trained to perform FEA. Only capable engineers can create high quality simulations _that accurately model the real world_ and produce accurate, useful results.

How do you become a capable (structural) engineer? You start with the basics. Know your Statics, know your Mechanics of Materials. Notice I didnt say "Take ME 270". Classes will help you learn the material, but you can learn the material without classes, and you can certainly pass a class without learning the material.

One of the fastest ways to cover these topics is:&#x20;

[https://efficientengineer.com/topics/](https://efficientengineer.com/topics/)&#x20;

This channel is great. Start here:&#x20;

<figure><img src="../../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>

A good place to start with SimCenter3D is with 1d beam analysis:&#x20;

{% embed url="https://www.youtube.com/watch?v=fFddyaSDfmI" %}

**General**

* TURN ON ADVANCED ROLE ALWAYS!
* Name everything
  * Collectors, meshes, CBUSH’s, everything. This is an absolute must in an organizational setting where others will review/colloborate on/debug your .fem

\


**Files/Saving/Logistics**

* Simulation files are organized as a .sim, attached to a FEM model in a .sim, referencing a part in a .prt (and/or an idealized part, .i)
* Want a copy of a sim/fem? Save As > New Item&#x20;
  * DONT USE NEW REVISION! This does weird things to the original
* When creating a new .fem: ALWAYS set polygon body resolution to high
* .dat is where everything gets saved once you click solve. This is the NASTRAN file that is actually run and processed.
  * you can right click solution (?) i think? to view file location
* Importing files
  * Dont "auto stitch bodies" it does shitty things. not sure why

\


**The .fem**

* Right click the fem in the simulation navigator > edit > useful menu
  * ALWAYS change polygon body resolution to high if not already
  * Can change geometry options here too&#x20;
    * Import points
* When creating, be conscious of whether you want an .i part or not.&#x20;
  * My advice: Make a .i until you feel comfortable enough not using it.
* Dont touch anything else unless you know what you are doing
* “Edit Display”
  * Very useful for all sorts of things. You want to be comfortable when doing analysis, and the display is part of that. It provides you information to do your job better.
* Mesh Collectors
  * Typically you want elements with mid nodes
  * theres a setting somewhere to make the processor do non-linear element treatment, turn that on
  * 1D
    * Beam Cross sections
    * 2D
      * shell and plate elements
        * honestly just use shells i think. The difference is weird so google it.
    * 3D
  * cubes ("hex") or pyramids (tetrahedrons ("tets")

<figure><img src="../../.gitbook/assets/image (47).png" alt="" width="375"><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/image (48).png" alt="" width="375"><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/image (49).png" alt="" width="375"><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/image (50).png" alt="" width="375"><figcaption></figcaption></figure>

**The .sim**

* Model Setup check is kinda useless
  * honestly idk what it even does
* Want other info in your solution results?
  * right click the solution > "edit" > case control > structural output requests > edit > rerun sim
  * I highly recommend turning on strain energy and then viewing strain energy _density_ in the results. This is a great tool for visualizing the flow of strain (load) throughout your structure.
* Convergence
  * When stress-elemental and stress-elemental-nodal are about equal, your solution is most accurate (your mesh is typically fine enough).
