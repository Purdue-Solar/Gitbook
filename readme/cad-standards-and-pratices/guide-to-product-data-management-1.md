---
description: >-
  Product Data Management (PDM) refers to the system that manages CAD part
  files, drawings, analysis files, etc. This page is intended to summarize PSR's
  PDM system.
---

# Guide to Product Data Management

### Assemblies

<figure><img src="../../.gitbook/assets/siemens assembly flowchart.png" alt="" width="519"><figcaption><p>watch <a href="https://youtu.be/bbtpvibk4Po?is=dNVO6PZIOZ4pJrJ7">this</a> for a thorough understanding</p></figcaption></figure>

PSR Uses a Top Down - Bottom Up approach to assemblies.

* Top-Down allows us to drive the entire design from a master skeleton (Reference Assembly)
  * Larger assemblies that contain smaller parts ("components") will get more detailed the deeper you go
  * "Reference" assemblies will contain sketches and planes that define just the locations of components and features
  * "Sandbox" assemblies will use the references to build detailed parts so that if references are changed, the components will change neatly with them
* Bottom-Up ensures our final deliverables remain easy to manage in the BOM (Bill of Materials)
  * Hardware (bolts, nuts) are only placed in the "Final" assemblies to have a clean view
    * "Final" assemblies are great for understanding what a subsystem looks like, while "Sandbox" assemblies allow you to experiment with multiple designs of the same part

The best way to understand the system is by practicing it yourself. [This document](https://docs.google.com/document/d/15HrRm2HiU8R01lRwW0lauaZjhwGq3Oqzdrx-hO2FBW4/edit?tab=t.0) is a core part of mechanical onboarding and walks you through building a handbrake assembly with our system.

<figure><img src="../../.gitbook/assets/Screenshot 2026-09-02 113459.png" alt="" width="563"><figcaption><p>CAD this handbrake in NX!</p></figcaption></figure>

### Naming Convention

**Assembly Files:**

A000X\_AssemblyName.prt

* Assembly name should include the type of assembly (reference/sandbox/final)
*   The system-level assembly will be called Sub-Assemblies

    * ie. A000X\_BrakesReferenceAssembly.prt



**Part Files:**

P000X\_\[SA/FA] \_PartName\_Rev\[A/B/...].prt

* Part files should denote which assembly it is under (SA or sandbox and FA for final)
* There should not be more than one distinct part labeled with the same part number in each subsystem&#x20;
  * ie. P0001\_SA\_Upright\_RevA.prt and P0001\_SA\_Rocker\_RevA.prt is not ok
  * ie. P0001\_SA\_Upright\_RevA.prt and P0001\_SA\_TrailingArm\_RevA.prt is ok (different system)
*   Revisions can share the same part number; they will be denoted by RevA/B/C/...

    * Indicate which revision corresponds to what change in Notion
    * **FINAL ASSEMBLY PARTS SHOULD NOT HAVE REVISIONS**



**Off-the-Shelf Parts:**

SXXX\_PartName.prt

* XXX is the ID number of the part&#x20;
  * ie. for McMaster-Carr hardware: S91259A626\_AlloySteelShoulderScrew.prt
* McMaster will also download with .stp and .txt files, you can delete these when you have saved the hardware component as a .prt file
*   For OTS parts that do not have provider ID numbers, start from S0001

    * ie. S0001\_FrontShocks.prt



**FEA (.fem and .sim) Files:**

P000X\_SA\_PartName\_Rev\[A/B/C...].fem/.sim

* FEA files should not have to be renamed
* Save FEA files in the FEA folder (PSR FSGP27 > FEA)
  * Try to get an granular as you can with folders and archives beacuse FEA sims create a lot of extraneous files
  * **DO NOT SAVE FEA IN THE CAD FOLDER**
