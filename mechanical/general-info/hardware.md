---
description: Bolts, nuts, pins, bushings, bearings, and more
icon: screwdriver-wrench
---

# Hardware

When we say "hardware" in mechanical engineering, we refer to the standard (often) metal components that secure other parts together and/or help them move more smoothly. The most classic example of this is a bolt and nut, but there are many many more pieces of hardware used on the car.

\[insert picture of a bolt and a nut, label which is which]

A large portion of our hardware is ordered directly off of [mcmaster.com](https://mcmaster.com), which we refer to as McMaster. For more specialized hardware like suspension swivel joints, websites like [timken.com](https://timken.com) also come in handy (although be sure that the part you're designing for actually exists...). For less specialized hardware, in-person trips to brick and mortar hardware stores like Menards may be quicker.

#### Standard Hardware

This [spreadsheet](https://docs.google.com/spreadsheets/d/1loBMHhL5lEdDHvUSlIfMUOq4QubE4RNVE5yF3ODTN94/edit?gid=0#gid=0) lists Mechanical's commonly used hardware. Refer to it when deciding what hardware to use, because there are many styles of hardware that will achieve the same function (different plating, thin or full profile nuts, fine or coarse threading); keeping these standard is cheaper and makes assembly easier.

### Design

* placed in final assemblies, using STEP files from McMaster with no threads - we don't need to see em and it makes assemblies load faster
* assembly constraints - see end of the [assemblies tutorial doc](https://docs.google.com/document/d/15HrRm2HiU8R01lRwW0lauaZjhwGq3Oqzdrx-hO2FBW4/edit?tab=t.0#heading=h.z99t6jse1c33)
* Bill of Materials (BOM) - list of parts, including hardware
  * [here](https://docs.google.com/spreadsheets/d/1TEpdzDaXZCXzlvgXYFLtNxiyENT4nE1_JZkspxLFQ24/edit?gid=1600730585#gid=1600730585) is the Artemis '26 BOM as an example, though we'll be better organized in the future
* check rules requirements - grade, threads past the nut if critical
* spares
* check clearances esp for swivel joints
* think about fitting a wrench in there, the length of a socket, the space that the socket arm has to rotate
* may have to fea, hand calcs are doable sometimes

### Manufacturing

* tolerances!!!! +-5 thou for shoulder bolts, also consider screw clearance holes (dont use the nx option look up a table), press fits, blabla
* like always, think about dfm - if you use a retaining ring you'll need a grooving tool that isn't too thick
* epoxied parts need a few thou of space - check with those who know better like composites

### Assembly

* nuts and bolts and washers are so easy to lose, when putting things together or taking them apart do not lose track of them, put them in a bucket or something, and put things where other people will think to look for them
* sometimes if you have trouble lining up a hole bunch of washers for a shoulder bolt to go through a bracket, you can stick an allen wrench in there and wiggle it a bunch to get them in line
* socket wrenches are so nice, be careful about keeping sets together

### More Specific

* shoulder bolt uses shims to shorten
* bolts in general want a washer under the head and under the nut to spread the force over a larger area
* to press fit a bearing, you may have to heat up the part it goes into to make the hole larger, then let it cool to be tight
  * otherwise, you can press a bearing in by force using an arbor press and a lathed piece of stock in between that only touches the sturdy metal part of the bearing

