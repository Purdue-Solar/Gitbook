---
description: Specifically for use with the NASTRAN solver
---

# How to not cry while using SimCenter3D

**Prologue**

* Right click the fem in the simulation navigator > edit > useful menu
  * ALWAYS change polygon body resolution to high if not already
  * Can change geometry options here too&#x20;
    * Import points
* When creating, be conscious of whether you want an .i part or not.&#x20;
  * My advice: Make a .i until you feel comfortable enough not using it.
* Dont touch anything else unless you know what you are doing
* “Edit Display”
  * Very useful for all sorts of things. You want to be comfortable when doing analysis, and the display is part of that. It provides you information to do your job better.

Meshing

* you want elements with mid nodes (tet10, etc) (google it)
* theres a setting somewhere to make the processor do non-linear element treatment, turn that on
* 1D
  * Beam Cross sections
  * 2D
    * shell and plate elements
      * honestly just use shells i think. The difference is weird so google it.
  * 3D
* cubes ("hex") or pyramids (tetrahedrons ("tets")

Anyone can be trained to perform Finite Element Analysis (FEA), but it requires a capable engineer to create high quality Finite Element Models (FEMs) and use them to _model the physics of the real world,_ producing accurate, useful results.

So how do you become a capable (structural) engineer? You start with the basics. Know your Statics, know your Mechanics of Materials. Notice I didnt say "Take ME 270". Classes will help you learn the material, but you can learn the material without classes, and you can certainly pass a class without learning the material.

One of the fastest ways to cover these topics is:&#x20;

[https://efficientengineer.com/topics/](https://efficientengineer.com/topics/)&#x20;

This channel is great. Start with these topics, in order:&#x20;

<figure><img src="../../.gitbook/assets/image (5).png" alt=""><figcaption><p>At the very least cover the first 3.</p></figcaption></figure>

Next, watch this introductory video:

{% embed url="https://www.youtube.com/watch?v=tNNd7jG4Keg" %}
Basic 3D solid meshing tutorial
{% endembed %}

Further resources: [https://community.sw.siemens.com/s/article/Simcenter-3D-Basics](https://community.sw.siemens.com/s/article/Simcenter-3D-Basics)

