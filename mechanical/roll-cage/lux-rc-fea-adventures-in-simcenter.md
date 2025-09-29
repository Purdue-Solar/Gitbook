---
description: A memoir
---

# Lux RC FEA - Adventures in Simcenter

Chapter 1: Strange Loops

_Strange Loops:_ prologue to Pullitzer Prize-winner "Goedel Escher Bach: An Eternal Golden Braid" - A meditation on the work of Kurt Goedel, MC Escher, and Johann Bach. Clearly, strange loops themselves loops back into life itself, in an.... dare i say... eternal golden braid.

"_Time is a flat circle" -_ Rust Cohle



NX hates strange loops. Trying to do FEA on a soup can? You are cooked. Add a random line down the side, and suddenly the mesher has a place to "start" and its peachy.

"The modeler gets scared, the mesher gets confused, its a mess." - Adin Freese



<figure><img src="../../.gitbook/assets/image (1) (1) (1) (1) (1).png" alt=""><figcaption><p>The mesher likes to chop up our soup cans for us. This is sketchy sometimes but mostly works, actually.</p></figcaption></figure>



The merge face tool in polygon geometry can be used to fix this (face based then box select everything). This gets rid of the crappy edges it generates. Delete mesh and remesh. Itll typically do better the second time.&#x20;

What if it doesnt? Well idk tbh. Keep trying. Maybe try edge based. Little this, little that

Ok it finally worked. damn.

<figure><img src="../../.gitbook/assets/image (1) (1) (1) (1).png" alt=""><figcaption></figcaption></figure>



<figure><img src="../../.gitbook/assets/image (1) (1) (1) (1) (1) (1).png" alt=""><figcaption><p>1.006 SF. Can bump up front fillet size.</p></figcaption></figure>

Time to increase fillet size from this.

File is giving Fatal Message 1250 for insufficient disk space. Didnt end up needing these but seem like useful/helpful articles:&#x20;

[https://www.learningfea.com/2016/01/debugging-a-nastran-fatal/](https://www.learningfea.com/2016/01/debugging-a-nastran-fatal/)

{% embed url="https://support.sw.siemens.com/en-US/okba/KB000153645_EN_US/How-to-Change-the-Nastran-Scratch-Directory-in-Simcenter-3D-A-Step-by-Step-Guide/index.html" %}

