---
description: Procedure used for finding center of gravity height of physical car
---

# CG Height Tipping Procedure

The center of gravity (CG) of the car is an important data point used to calculate how the car reacts to various forces. The longitudinal and lateral dimensions of the CG (x and y) are easy to find by placing scales under each wheel and by measuring wheelbase and track width. However, the CG height must be found by lifting the rear wheel a known height off the ground and then doing a little trigonometry. This was especially necessary just after building Artemis when we found that the car was more than 40 kg heavier than we'd designed it to be (314 kg instead of 265) (possibly due to unaccounted-for composites resin and epoxies, and electrical wiring).

<figure><img src="../../.gitbook/assets/artemis in klon.jpg" alt="" width="563"><figcaption><p>car at rest</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/image (81).png" alt=""><figcaption><p>car raised</p></figcaption></figure>

### Parameters

Wheelbase - the distance between the front (or middle of the front wheels) and rear tire contact patches

Track width - Track width is the distance between the contact patches of the front wheel (center to center)

Static front wheel weight - the combined weight on the front wheels when all 3 are on scales

Raised front wheel weight - the combined weight on the front wheels when the rear is raised

Raised height - the height at which the rear is raised, as in the vertical displacement of the rear axle - can be approximated by measuring the distance from the bottom of the tire to the scale under it; should be 10 inches or more for increased accuracy

#### Calculations

<div><figure><img src="../../.gitbook/assets/cg calcs page 1.webp" alt="" width="247"><figcaption></figcaption></figure> <figure><img src="../../.gitbook/assets/cg calcs page 2.webp" alt="" width="247"><figcaption></figcaption></figure></div>

Images and Matlab script by Casey, with measurements from 9/5/2026

```
% Units: Meters (m), Newtons (N), Kilograms (kg)
% Coordinate System: x = forward, y = left (outboard), z = up. Origin at ground.

clear; clc;

%% Inputs: Vehicle Parameters
w_tot = (201.5+201.65+283.3)/2.205;  % Mass of car, entered in lbs (kg)
tw = 1.2;           % Track Width (m)
wb = 2.2;           % Wheelbase (m)
r_tire = 0.2794;    % Radius of Loaded Tire (m)
h_raised = 12 * .0254;        % Height Center of Rear Wheel was raised to when measuring (m)
fw_level = (201.5+201.65)/2.205;       % Mass on front wheel when car is level (kg)
fw_raised =  (209+212)/2.205;       % Mass on front wheel when car is raised (kg)

%%Calculations
adj = sqrt((wb^2)-(h_raised^2));
tantheta = h_raised/adj;
cgh =(wb * (fw_raised-fw_level))/(tantheta*w_tot);
h_cg = cgh + r_tire;
h_cg_in = h_cg/.0254 ;

fprintf('Center of Gravity Height is %.2f in.\n', h_cg_in);
```

#### Procedure

Make sure all weights are on the car and at the correct height distributions, including the driver with their ballast, top shell, and battery. A ballast bag of the right weight and approximate CG height can replace the battery in a pinch, as long as the bag doesn't slide too much.

Measure the length of the shocks while the car is fully loaded, after which you can prop up the car and lock the shocks. If the shocks aren't able to lock on their own, then you may have to replace them entirely with a strong rigid object, such as an aluminum plate with bolt holes where the shock eyelets would be when fully loaded. This step is especially necessary and will throw off calculations heavily otherwise.&#x20;

Place the car onto zeroed scales (lift one end of the car at a time and have someone slide scales under the wheels). Record the static weight of all three wheels.

Get a box or some sturdy object (large aluminum stock) of a known height greater than 10 inches and carefully raise the car so that the rear wheel rests on the box. It is better calculations-wise to raise the car from the rear wheel, and  The driver should be holding the brakes down whenever the car is raised so it doesn't roll off the scales. Record the new weights of the front wheels.

The weight shift to the front wheels should be ballpark 10-20 lbs each, and our first attempt on 8/29/26 with unlocked shocks had a far greater weight shift that resulted in more than 133 in as the CG height. The successful attempt on 9/5/26 with aluminum linkages resulted in 27.1 in (.688 m) as the CG height estimate, which is far more accurate. The intended CG height of Artemis was .393 m, and the significant increase likely comes from, among other things, a much heavier topshell that is missing a lot of intended weight-saving cutouts.

### Notes

* it should also be doable to tip the car on its side instead of forward - would need to rework calculations
* estimate from 9/5/26 was an estimate
  * not all electrical components (wave sculptors, low voltage wiring) were in the car
  * battery ballast was two bags that added to 30 kg instead of 32, may have slid across the chassis floor several inches during tilting, and don't have the exact same center of height as the battery (perhaps an inch or two off)
  * driver may have been a few kgs over 80 due to use of different ballast bag

