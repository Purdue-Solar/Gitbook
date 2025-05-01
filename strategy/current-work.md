# Current Work

Strategy Projects:

**Data Matching** - Match data from ASC GPS and Lux's system. Lux's system stores data from the motor, mppt, LV boards, and BMS. ASC's GPS stores position data, and UTC time. \
Lux's data is pretty much useless without knowing what time the data is from, but since both datasets store velocity we can match these curves to give Lux's data UTC time. This will make all data usable and presentable.



**Energy Estimator** (bad name make a better one) - This is a program that simulates the driving of a solar car across some route. The current program uses the ASC 2024 route and converts it to a spline where any point can be referenced. The program calculates the drag, rolling resistance, mechanical and electrical inefficiency's to find the energy lost per time step. Controllers have been added to maintain a constant speed, and to look ahead for hills to speed up to prevent stalling.

Future Updates - Solar data/estimation power in (Solcast), Winds should effect drag (headwinds hurt, tailwinds help), Better tools to choose start points/ end points maybe use lat long then find nearest point on spline from that, Regen braking.



**Solar Cell Cooling** - Simulate the efficiency of solar cells compared to temperature. Faster driving = more cooling and more efficient cells. Is there an ideal airspeed to maintain cool cells, and reasonable drag. Should we look into cell cooling channels? Incorporate into energy estimator.



**Digital Twin** - This is mostly for driver placement and driver training. This could be done in Unity or Unreal Engine. Unreal could be better with all of the new advancements with lighting and texture engines. The main goal of this is to recreate the car with accurate suspension travel, springs, and dampers. This will allow the drivers to "feel" how the car works long before we build it. This should be a low priority due to the large amount of work required to create this model for the minimal upsides.

This could also be used for showing the car to companies with VR/AR if they cannot make it to the race. This also give a better sense of scale.



**Telemetry Database** - This database stores data directly from the solar car. Data is sent from the solar car to the pits or chase car to this database. The data will be stored in a format that can be interfaced with a web browser. The current setup is postgres to store all data, then graphana to show the data. The webpage should have multiple pages, an overview (speed, SOC, errors, etc), battery, solar, motor, etc. This will be hosted on a single computer, and any computer on the same network can access the webpage with the IP address. This can also be shared to out website to have live data on the car along with progress for everyone to follow.



As more projects are created they should be added to this list. Feel free to be creative, if it peaks you interest and can benefit the club go for it. Share all developments with the strategy director.

\
