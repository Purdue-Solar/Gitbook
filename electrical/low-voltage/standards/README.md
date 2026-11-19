# Standards

External connectors should ALL use molex microfit 3.0 connectors:

* Vertical right-angle connectors (such that one pin is stacked on top of another in a column) should be used for power (and ground) wires going to/coming from a board.
* [Example of connector](https://www.digikey.com/en/products/detail/molex/2125280200/12758133)
* Horizontal right-angle connectors (such that one pin is placed next to another in a row) should be used for CAN wires going to/coming from and board.
* [Example of connector](https://www.digikey.com/en/products/detail/molex/2189890210/17627773)

<br>

Boards should be 2 layers standard. If you believe you have reason to have more layers, please speak with a lead.

<br>

When using ICs, place bypass capacitors on their power pins.

<br>

Use power and ground planes as much as possible. Due to capacitance, this may need to be reviewed a bit more.

<br>

Use the DRC minimums uploaded to the GitHub for OSHPark.

<br>

Do not place vias in pads.

<br>

Avoid making loops and 90 degree angles when routing (when possible). This creates induced electric fields and increases the impedance in a circuit.

<br>

The shortest trace is generally best.

<br>

Component placement time should be much more time consuming than the actual routing. Good placement makes routing a cinch.

<br>

Ensure your traces are wide enough (mostly important for nets with more than .5 A). [Trace width calc](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-pcb-trace-width)

<br>

[https://resources.altium.com/p/vias-101](https://resources.altium.com/p/vias-101)

<br>

Choose components, read the datasheets, and make sure that they are in stock on Mouser or Digikey before starting PCB design. There is no point designing for something which doesn’t exist. Make sure you can either find the footprints for the components, or are willing to make them yourself.&#x20;

<br>

Prefer ground planes over power planes (ground planes should cover most of PCB)

<br>

Via stitch ground planes so that there is better continuity and return paths are shorter&#x20;

<br>
