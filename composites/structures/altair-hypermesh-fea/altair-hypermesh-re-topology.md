---
description: Tutorial for Altair Hypermesh re-topology tools
---

# Altair Hypermesh Re-Topology

#### What is Topology?

Topology is "the arrangement and connection of vertices, edges, and faces that form the surface structure of a digital mesh".

#### Why is topology important for FEA?

If you have bad topology, your FEA results will be unpredictable and/or inaccurate.&#x20;

Now what does good and bad topology look like?

* Kind of vibes but generally "bad" topology looks clearly unordered or strange.

Here's a example of bad topology:

<figure><img src="../../../.gitbook/assets/image (124).png" alt=""><figcaption></figcaption></figure>

* As you can see, the shapes are inconsistent and awkward.

Luckily, Hypermesh has tools to let you check your topology!

<figure><img src="../../../.gitbook/assets/image (125).png" alt=""><figcaption></figcaption></figure>

* Simply go to 2D -> Edit Elements -> 3 bars -> enable QI Color Mode
  * Default setting is QI range. Generally gives us a overview of the topology. Good topology is dark blue. Bad is blue, yellow is terrible, and red is really really terrible.

<figure><img src="../../../.gitbook/assets/image (126).png" alt=""><figcaption></figcaption></figure>

* You May also go by "Criteria"&#x20;
  * You can see multiple criteria. There are size criteria and criteria related to the shape of the mesh element.&#x20;
  * Click on Quality Index to view more in depth.

<figure><img src="../../../.gitbook/assets/image (127).png" alt=""><figcaption></figcaption></figure>

* Now, you can see the quality of your individual faces.
  * Red is really, really, really, really bad. Make sure there is no red
  * Orange is really, really, bad. Make sure there is no orange.
  * Yellow is definitely not good. try to reduce the amount of yellow.
  * Green is not good, but probably will be fine.
  * Light blue is most likely going to be fine.
  * Dark blue is perfect.

### Re-Topology Tools

Now, How do you fix it?

There are a few tools you can use

#### Move tool

* Use it to move vertices.
  * If the thing is locked to an axis, hold **alt** to unlock it.

A lot of things are fixable with the move tool.

<div><figure><img src="../../../.gitbook/assets/image (130).png" alt=""><figcaption></figcaption></figure> <figure><img src="../../../.gitbook/assets/image (128).png" alt=""><figcaption></figcaption></figure></div>

<figure><img src="../../../.gitbook/assets/image (131).png" alt=""><figcaption></figcaption></figure>

Top half: untouched. Bottom Half, only move tool was used.

