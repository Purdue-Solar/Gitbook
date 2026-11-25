# LTST-C190GKT Resistor Calculations
## Background
**Reference Reading**
1. [LTST-C190GKT Datasheet](electrical/low-voltage/components/telemetry/refs/LTST-C190GKT/LTST-C190GKT.pdf)

**Why this part was chosen**
This part is available in the ECE shop for free. 
## Calculations
<div align="center">
  <img src="electrical/low-voltage/components/telemetry/refs/LTST-C190GKT/LTST-C190GKT-Fig2.png" alt="Forward current vs. forward voltage graph taken from datasheet." width="400">
</div>
Consider the following:$$\begin{align}V_1&=12\ \text V \\ V_2&=5\ \text V \\ V_3&=3.3 \ \text V \\ V_D &= 2.05 \ \text V \\ I_F&=10\ \text{mA}\end{align}$$Where $V_1$, $V_2$, and $V_3$ are the rails each status LED is meant to represent. $V_D$ is the inferred voltage drop at $I_F$ given from the datasheet (Fig. 2). A forward current of 10 mA will produce a green light at 6.0 mcd of intensity (pg. 3) which was deemed "good enough".

We can calculate the required current limiting resistor in series with each diode using Ohm's law:$$R = \frac{V_n - V_D}{I_F}$$Therefore, the calculated resistance for the +12 V LED rounded to the nearest standard value is:$$R_1 = \frac{(12 - 2.05)\ \text V}{10\ \text{mA}}=995\ \ohm\approx\boxed{1\ \text{k}\ohm}$$For the +5 V LED:$$R_2 = \frac{(5 - 2.05)\ \text V}{10\ \text{mA}}=295\ \ohm\approx\boxed{300\ \ohm}$$And for the +3.3 V LED:$$R_3 = \frac{(3.3 - 2.05)\ \text V}{10\ \text{mA}}=125\ \ohm\approx\boxed{120\ \ohm}$$