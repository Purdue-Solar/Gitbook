# Models

**Energy Estimator**

This model was originally created to find the maximum acceleration of the car with the intent to see if the car would be able to do a burnout. At first it seemed like a few simple torque calculations but there is much more math behind it. Now the program is able to "accurately" predict the energy use of the car with a few simple inputs. This paragraph goes over the development of the program and problems encountered along the way.



{% file src="../.gitbook/assets/Energy_Consumption_Update.py" %}
Energy Model (Updated 11/2/24)
{% endfile %}

This program is not currently user friendly and you must understand some of the code for it to work. Constants at the top define the car, most of the can remain unchanged as they are defined by the wheels we use or general assumptions about air. Other things such as weight, wheel diameter, and frontal area must be changed.

The general structure of the program is to start with all of the constants given for the car and a list of points which the car will pass through. These points can be retrieved through "Google My Maps". This is not the same as google maps and allows the export of KML which can be parsed to get lat long data. After removing the fluff, elevations must also be found. The estimator requires the format \[lat, long, elevation (m)]. Each line is a new point progressing in the race. Once this data is fed in the program will run through in a transient style making very small increments and solving for the energy used during this time. Currently the program is just for energy output and doesn't account for solar inputs so voltage drop is not considered. Energy consumption is calculated for rolling resistance, drag, and electrical boards pull. The last part of the energy consumed and the majority of it is by the motor which requires a dyno to find the energy use curve, we do not have this. Luckily some dude somewhere decided to do this for use. He made is own motor of a very similar power, size, and optimal speed and posted a research paper on it with graphs for efficiency and power output. During the drive the car is assumed to drive at a constant speed and a count for number of turns (slowing down to a stop, then speeding back up).&#x20;

This program should be valid to find the energy consumed between two positions within 5%.  The model is not known to be perfect right now since the CDA for Lux is not certain.

&#x20;

{% file src="../.gitbook/assets/ELEN_alperkerem-Motor_Research.pdf" %}
Motor Research Paper
{% endfile %}

## Google Maps Elevation API

```python
"""
Required folder structure:
top level directory
|_(this code file)
|_input
  |_files with coordinates
|_output
  |_store files with elevations
"""

import requests

files = ["Enter filenames here; files should be in the input directory"]

url = 'https://maps.googleapis.com/maps/api/elevation/json'

for file in files:
    coordinates = []
    with open(f"input/{file}", 'r') as f:
        coordinates = f.readlines() # Coordinates in the files should be in "latitude,longitude" format

    with open(f"output/{file}", 'a') as f:
        num_coord = len(coordinates)
        while (num_coord >= 512):
            locations = ""
            for idx in range(512):
                locations += coordinates[idx].strip() + '|'
            locations = locations[:-1]

            params = {
                'locations': locations,
                'key': "ENTER YOUR API KEY HERE" # Get the API key on the google maps platform
            }

            response = requests.get(url, params=params)
            data = response.json()

            for idx in range(512):
                f.write(f"{round(data['results'][idx]['elevation'], 6)}\n")

            num_coord -= 512
            coordinates = coordinates[512:]

        locations = ""
        for idx in range(num_coord):
            locations += coordinates[idx].strip() + '|'
        locations = locations[:-1]

        params = {
            'locations': locations,
            'key': "ENTER YOUR API KEY HERE"
        }

        response = requests.get(url, params=params)
        data = response.json()

        for idx in range(num_coord):
            f.write(f"{round(data['results'][idx]['elevation'], 6)}\n")

print("done")
```
