---
description: Bolts, nuts, pins, bushings, bearings, and more
icon: screwdriver-wrench
---

# Hardware

When we say "hardware" in mechanical engineering, we refer to the standard (often) metal components that secure other parts together and/or help them move more smoothly. The most classic example of this is a bolt and nut, but there are many other pieces of hardware used on the car.

&#x20;               &#x20;

<div><figure><img src="../../.gitbook/assets/image (97).png" alt="" width="175"><figcaption><p>This is a bolt.</p></figcaption></figure> <figure><img src="../../.gitbook/assets/image (98).png" alt="" width="188"><figcaption><p>Look at these nuts!</p></figcaption></figure></div>



A large portion of our hardware is ordered directly off of [mcmaster.com](https://mcmaster.com), which we refer to as McMaster. For more specialized hardware like suspension swivel joints, websites like [timken.com](https://timken.com) also come in handy (although be sure that the hardware you're designing for actually exists...). For less specialized hardware, in-person trips to brick and mortar hardware stores like Menards may be quicker.

#### Standard Hardware

This [spreadsheet](https://docs.google.com/spreadsheets/d/1loBMHhL5lEdDHvUSlIfMUOq4QubE4RNVE5yF3ODTN94/edit?gid=0#gid=0) lists Mechanical's commonly used hardware. Refer to it when deciding what hardware to use, because there are many styles of hardware that will achieve the same function (different plating, thin or full profile nuts, fine or coarse threading); keeping these standard is cheaper and makes assembly easier.

### Design

* Hardware is placed in final assemblies by downloading from McMaster as a STEP file with no threads (optimizes assembly load time) and then importing the STEP file into NX (converts it to the proper file type, part)
* Hardware is constrained using NX assembly constraints which is shown in the [assemblies tutorial doc](https://docs.google.com/document/d/15HrRm2HiU8R01lRwW0lauaZjhwGq3Oqzdrx-hO2FBW4/edit?tab=t.0#heading=h.z99t6jse1c33)
* The Bill of Materials (BOM) is a list of parts and costs, including hardware and materials
  * [Here](https://docs.google.com/spreadsheets/d/1TEpdzDaXZCXzlvgXYFLtNxiyENT4nE1_JZkspxLFQ24/edit?gid=1172243011#gid=1172243011) is the Artemis '26 BOM as an example, though we'll be better organized in the future
* Check the rule requirments for harware found in the [ASC rulebook](https://www.americansolarchallenge.org/wp-content/uploads/2025/11/ASC2026_Regulations_Revision_B.pdf)
  * Grade, threads past the nut if critical,
* Safety wiring must be used for blind holes (holes that don't go all the way through)
* Having spare harware components is important
* Always double check clearance on swivel joints (the range of motion a bolt has)
  * Think about fitting a wrench in there, the length of a socket, the space that the socket arm has to rotate
* Hardware may have to FEA'd, hand calcs are somtimes a valid option

### Manufacturing

* Tolerances!!!! +-5 thou for shoulder bolts, also consider screw clearance holes (dont use the nx option look up a table), press fits, blabla
* Tolerances!!!
  * ±5 thou (5 thousands of an inch) for shoulder bolts
  * Screw clearance holes should be found in online tables, NOT NX default options
  * Types of fits can also be found online (Clearance, interference, transition, etc.)
* Always keep Design For Manufacturing (DFM) in mind
  * Geometry needs to be machinable and certain hardware warrants specific tools such as retaining rings which require a specific grooving tool to be bought
* Parts/Hardware that are epoxied (glued) on need a few thou of clearance to fit properly - check with composites to make sure you are accounting for enough room

### Assembly

* Nuts, bolts, and washers are so easy to lose, when putting things together or taking them apart do not lose track of them
  * When working on the car some people put hardware in a bucket or bin as to not lose their parts
  * When putting things back make sure you put them in their proper place and if they don't have one put it where you think others will find it
* If having trouble lining up a bunch of washers/shims on a shoulder bolt going through a bracket you can stick an Allen wrench in there and wiggle it to get align them
* Please keep our tool sets together and organized, for example, the socket wrenches and Allen wrenches
* sharpie mark on head and surface

### More Specific

* Shims are used to shorten shoulder bolts
* Washers should generally be put under a bolt head and under the nut to spread the force over a larger area
* Press fitting a bearing requires heating up the part the hardware goes into to (expansion), then letting the part cool to tighten
  * Otherwise, you can press a bearing in by force using an arbor press and a lathed piece of stock in between that only touches the sturdy metal part of the bearing
