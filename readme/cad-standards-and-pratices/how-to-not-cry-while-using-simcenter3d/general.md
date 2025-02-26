# General

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



(Ignore this) CBUSH Stiffness Calculation

<figure><img src="../../../.gitbook/assets/image (54).png" alt=""><figcaption></figcaption></figure>
