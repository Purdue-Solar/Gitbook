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

* how to name part files and assemblies according to subteam and subsystem
