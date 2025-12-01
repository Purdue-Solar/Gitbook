# General

Next, run through this 1d beam analysis:&#x20;

{% embed url="https://www.youtube.com/watch?v=fFddyaSDfmI" %}

**General tips:**

* TURN ON ADVANCED ROLE ALWAYS!
* Name everything!
  * If its for PSR, someone else will one day look at your .fem and theyll need to know whats what.&#x20;
  * Collectors, meshes, CBUSH’s, everything. This is an absolute must in an organizational setting where others will review/colloborate on/debug your .fem

<br>

**Files/Saving/Logistics**

* Simulation files are organized as a .sim and are where Boundary Conditions (BCs) are applied. They reference/are attached to a FEM model in a .fem, which references part geometry in a .prt (sometimes the .fem references an idealized part, .i, which then references the .prt.)
* Want a copy of a sim/fem? Save As > New Item&#x20;
  * DONT USE NEW REVISION! This does weird things to the original
* When creating a new .fem: ALWAYS set polygon body resolution to high
* .dat is where everything gets saved once you click solve. This is the NASTRAN file that is actually run and processed.
  * you can right click solution (?) i think? to view file location
* Importing files
  * Dont "auto stitch bodies" it does shitty things. not sure why



(Ignore this for now) CBUSH Stiffness Calculation

<figure><img src="../../.gitbook/assets/image (54).png" alt=""><figcaption></figcaption></figure>
