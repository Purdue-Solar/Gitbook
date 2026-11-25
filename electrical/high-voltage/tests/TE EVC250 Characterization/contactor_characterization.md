# Transient Current Analysis of TE EVC 250
**Summary**
The objective of this report is to investigate the transient behavior of current supplied to the TE EVC 250 contactor on startup. Results suggest the TE EVC 250 draws a peak current of **2.48 A @ 12 V** within **235ms** when opening. Closing the contactor required significantly less current. The contactor failed to open when less than **3.575 As⁻¹** was supplied.

**Equipment Used**
1) Keysight DSOX1204G : Oscilloscope to measure voltage
2) Fluke 115 Multimeter : Ammeter to measure current
3) Jesverty SPS-3010 : Benchtop power supply
4) Wire spool : Used in lieu of a current shunt
5) TE EVC 250 : Device under test
## 1. Shunt Resistor Characterization
### 1.1. Background
<div align="center">
  <img src="electrical/high-voltage/tests/TE EVC250 Characterization/refs/spool.png" alt="Wire spool used as current shunt" height="250">
  <br>
  <em>Fig 1. Wire Spool Used During Testing</em>
</div>

A calibrated shunt resistor was not available for testing. As a result, a spool of wire was used instead. Resistance is governed by Ohm's law:$$ V = IR$$Rewritten, the unknown resistance of the wire spool can be found through:$$\boxed{R = \frac V I}$$
### 1.2. Method
DC voltage across the wire spool was measured using the Keysight oscilloscope and the current was measured using the Fluke multimeter. Using the rewritten Ohm's law, the resistance of the spool was calculated.
### 1.3. Results & Conclusion

<div style="margin: 0 auto; width: fit-content;"> <table style="border-collapse: collapse; margin: 0 auto;"> <thead> <tr> <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">Trial</th> <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">Current (A)</th> <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">Voltage (V)</th> <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">Resistance (&Omega;)</th> </tr> </thead> <tbody> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">1</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.500</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.48106</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.962</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">2</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.187</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.17790</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.951</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">3</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.369</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.35417</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.960</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">4</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.869</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.83885</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.965</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">5</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">1.015</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.98410</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.970</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">6</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">1.355</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">1.31150</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.968</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">7</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">1.550</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">1.50170</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.969</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">8</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">1.761</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">1.70980</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.971</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">9</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.082</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.02510</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.973</td></tr> <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">10</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.160</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.10530</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">0.975</td></tr> </tbody> </table> <p style="text-align: center; font-style: italic; margin-top: 8px;">Table 1. Current &amp; Voltage Across Wire Spool</p> </div>
The calculated line of best fit going through the origin suggests the wire spool has a resistance of **971 mΩ**. Future attempts at characterization should consider purchasing a calibrated/certified shunt such as those offered in the [Bourns RSB series](https://www.digikey.com/en/products/detail/riedon-products-by-bourns/RSB-500-50/4967074). 
## 2. Transient Current of the TE EVC 250
### 2.1. Background
< what is a TE EVC 250 contactor >
### 2.2. Method
A 971mΩ shunt resistor and the Fluke 115 were placed in series with the contactor (Fig 2.) The voltage across the shunt was measured with the Keysight DSOX1204G oscilloscope. The Fluke 115 multimeter was set to measure peak DC current as a sanity check for the calculated current across the shunt resistor.

<div align="center">
  <img src="electrical/high-voltage/tests/TE EVC250 Characterization/refs/schematic.png" alt="Circuit Schematic" width="600">
  <br>
  <em>Fig 2. Circuit Diagram of TE EVC 250 Testing Setup</em>
</div>

The circuit was powered by a Jesverty SPS-3010 benchtop power supply set to 12 V. The current control knobs were set to the maximum allowed value. Voltage & current limits persisted between power cycles. The method followed was:
1) Turn off power supply, set F115 to record max DC current
2) Turn on power supply
3) ~200ms later set oscilloscope to single trigger mode (prevents capture of early spikes)
4) Set cursors & record max current
5) Save screenshot
6) Repeat as necessary
### 2.3. Results

<div align="center">
  <img src="electrical/high-voltage/tests/TE EVC250 Characterization/refs/scope_33.png" alt="Wire spool used as current shunt" height="350">
  <br>
  <em>Fig 3. Waveform of Shunt Voltage on Contactor Startup</em>
</div>

Waveform captures of each trial are stored at `refs/` in `scope_32.png` to `scope_36.png`. The data suggests the **peak current is 2.5 A for 235ms**. The waveform observed was consistent in nature; logarithmically increasing, then dropping sharply to a stable idle current (Fig 3). I_peak is the calculated peak current from the voltage across the shunt. I_F115 was the recorded peak current from the ammeter. Note that the F115 does not sample at a fast enough rate to capture the transient behavior, hence the variation in recorded current. Noise in the signal was attributed to the power supply as it dropped off once turned off (Fig 4).

<div style="margin: 0 auto; width: fit-content; text-align: center;">

<table style="border-collapse: collapse; margin: 0 auto;">
  <thead>
    <tr>
      <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">Trial</th>
      <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">dX (ms)</th>
      <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">dY (V)</th>
      <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">I_peak (A)</th>
      <th style="border: 1px solid #333; padding: 8px 12px; text-align: center;">I_F115 (A)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">1</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">235</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.48125</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.555</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.471</td></tr>
    <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">2</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">235</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.48125</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.555</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.534</td></tr>
    <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">3</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">235</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.48125</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.555</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.399</td></tr>
    <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">4</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">235</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.48125</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.555</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.498</td></tr>
    <tr><td style="border: 1px solid #333; padding: 8px 12px; text-align: center;">5</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">235</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.48125</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.555</td><td style="border: 1px solid #333; padding: 8px 12px; text-align: right;">2.515</td></tr>
  </tbody>
</table>

<p style="font-style: italic; margin-top: 8px;"align="center">Table 2. Measured Current & Time to Open.</p>

</div>

![](electrical/high-voltage/tests/TE%20EVC250%20Characterization/refs/waveform.MOV)
<div align="center">
  <em>Fig 4. Video Capture of Shunt Voltage Waveform on Contactor Startup</em>
</div>
