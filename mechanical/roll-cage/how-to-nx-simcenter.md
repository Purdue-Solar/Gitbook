---
description: We NX and Simcenter
---

# How to NX Simcenter

## Creating new FEM and SIM files

Navigate to the **Application** tab and find **Pre/Post.** Click **New FEM and Simulation**.&#x20;

<figure><img src="../../.gitbook/assets/image (104).png" alt=""><figcaption></figcaption></figure>

Do not select Create Idealized Part. This will create another model separate from the original. Any changes made to the idealized part will not reflect in the original part. This feature is meant to simplify complex shapes for better meshing geometry. That isn't applicable for the roll cage, however, you may use it in future projects! New FEM and SIM files will be created after hitting **OK**.&#x20;

<figure><img src="../../.gitbook/assets/image (105).png" alt="" width="328"><figcaption></figcaption></figure>

## Opening FEM and SIM files

If you already have FEM and SIM files, you can open them like how you would a normal part. You may need to change your file filter from .prt to all.&#x20;

## Setting up mesh

Select **3D Tetrahedral** on the top bar.&#x20;

<figure><img src="../../.gitbook/assets/image (106).png" alt=""><figcaption></figcaption></figure>

Select the body you want to mesh. The element type should be **CTETRA(10)**. Set the element size to **10 mm** (you can alter this based on the strength of your computer, but 10 mm is a good place to start). Change the surface meshing method from Standard to **Mesh from Facets**. This allows Simcenter to handle roll cage geometry better. Everything else can remain the same. Feel free to play with and look up settings as you please (I would recommend **Minimum Element Size** or **Small Feature Tolerance**). &#x20;

<figure><img src="../../.gitbook/assets/image (107).png" alt="" width="375"><figcaption></figcaption></figure>

In the Simulation Navigator, 3D Collectors > **Solid** > edit.&#x20;

<figure><img src="../../.gitbook/assets/image (109).png" alt="" width="375"><figcaption></figcaption></figure>

Select **PSOLID**. Click the small wrench icon (**edit**).&#x20;

<figure><img src="../../.gitbook/assets/image (111).png" alt="" width="375"><figcaption></figcaption></figure>

Click the small icon next to material (**Choose material**).&#x20;

<figure><img src="../../.gitbook/assets/image (110).png" alt="" width="375"><figcaption></figcaption></figure>

Scroll down to **New Material**. Click the small icon next to Create (**Create Material**). I would use an online database ([https://www.matweb.com/](https://www.matweb.com/)) to find properties of certain metals. **Name** the material accordingly. For FEA, we will need to know three properties: **Mass Density**, **Young's Modulus**, and **Poisson's Ratio**. Fill these out according to the values from the database. Ensure the units are correct. When reanalyzing the roll cage from Artemis, we will use **Ti-6Al-4V** as our material of choice. Click **OK** when finished. Make sure the material in PSOLID is defined as the material you just created.&#x20;

<figure><img src="../../.gitbook/assets/image (112).png" alt=""><figcaption></figcaption></figure>

Check your mesh quality with **Element Quality** in the top bar. Select the roll cage as your body of interest. Click **Check Elements**. If the mesh is set up correctly, there should be **0 failed elements.** The notification will appear at the bottom of your screen.&#x20;

<figure><img src="../../.gitbook/assets/image (117).png" alt="" width="375"><figcaption></figcaption></figure>

## Setting up simulation

Save your .fem file and move to the .sim file. If these files were created together, they should already be linked.&#x20;

<figure><img src="../../.gitbook/assets/image (114).png" alt=""><figcaption></figcaption></figure>

Click **Constraint Type** in the top bar. There are many contraints to choose from. The most simple one is the **fixed** constraint. This locks all movement and rotation at that face or point. We will use a fixed constraint to represent the mounts bolted to the chassis. These will go on the underside of all the mounts (to make this easier,&#x20;

<figure><img src="../../.gitbook/assets/image (115).png" alt="" width="375"><figcaption></figcaption></figure>

The mounting surface should be blue when you click **OK**. This means that the nodes on the mounting surface are constrained.&#x20;

Now we will set up our forces. Click **Load Type** on the top bar. We will be using a simple **Force.** Specific details about FEA are found in the Rules & Regulations ( [roll-cage-rules.md](roll-cage-rules.md "mention")). In this example, we will be analyzing a 5g sideways impact force to the top of the roll cage. 5g is 5\*g\*car\_weight. There is a load patch already created on the top right corner of the roll cage. Select the faces of the load patch. We will use an estimated car weight of 320 kg. Input the **magnitude** of force. Specify the **vector** that the force is facing. Since this is a sideways load, the direction of the force vector should point to the positive y-axis.&#x20;

<figure><img src="../../.gitbook/assets/image (116).png" alt=""><figcaption></figcaption></figure>

You should see red arrows pointing towards the roll cage to represent the force acting on the load patch.&#x20;

Create **Solution** from the top bar. Make sure your settings are selected as **Structural** and **SOL 101 Linear Statics**. Click **Create Solution**. Click **OK**. We will go over methods for doing iterative solvers and strain analysis later, since that is a lil out of the scope for this tutorial.

Drag the constraint and load containers we just made into the constraint and load folders under Solution 1. Ensure they are **Active**. &#x20;

<figure><img src="../../.gitbook/assets/image (120).png" alt="" width="375"><figcaption></figcaption></figure>

When you are ready, click **Solve** in the top bar and then **OK**. This will start the analysis. This will open a bunch of popups (don't close anything yet). The **Solution Monitor** will show a lot of mumbo jumbo, but also give you info about fatal errors or warnings that occur. Once you have confirmed that there are no errors, you can close the popups. Navigate to **Results > Structural** in the Simulation Navigator.&#x20;

<figure><img src="../../.gitbook/assets/image (121).png" alt="" width="375"><figcaption></figcaption></figure>

We will look at **Displacement** and **Stress**. Check to make sure the displacement is less than the maximum outlined in the rules and regulations. Look at **Stress-Elemental** and **Stress-Elemental Nodal**. Elemental calculates the stress at the centroid of each element (tetrahedron), and applies that stress to the entire element. Elemental nodal calculates the stress at each node (corner) and makes a stress gradient on the element. Generally, you would want these two values to be as close as possible. If the values are for apart, consider reducing the element size in that area.&#x20;

Use **Worst** **Principal** stress analysis to get the highest compressive/tensile stress.&#x20;

<figure><img src="../../.gitbook/assets/image (122).png" alt="" width="375"><figcaption></figcaption></figure>

In this example, the elemental and elemental nodal stresses are far apart (|537| MPa and |774| MPa, respectively), indicating that our mesh is too coarse. Although, for this example, I wouldn't worry too much. A finer mesh would make your simulation time exponentially longer.&#x20;
