---
description: This page covers the data that is collected, the format, and some analysis
---

# Data

{% include "../.gitbook/includes/owners-block-seth.md" %}

## Apollo

The team began its resurgence with Apollo. We had very little data on previous cars and wanted to begin collecting data with our brand new car Apollo. A small team was developed off of Mechanical with ideas of collecting data such as acceleration, ground clearance, and temperatures.&#x20;

The final design which was only used during a few tests had one MPU 9250 mounted on the floor by the driver, a thermal couple right next to it, then 4 ultrasonic sensors, one in each corner of the car. This data was then saved to a local SD card all managed by a ESP 32. The ESP also hosted a web server that we could connect to through a webpage to start and stop data collection. Data was stored in csv, then read and graphed using python afterwards.

The data was interesting to look at, but without camera views, multiple people watching, or specific tests in mind we were unable to draw any conclusions.\


## Lux

An emphasis was put on data collection for Lux although not carried as well as we wanted due to lack of time. The plan was to have lux collect data from its components, store this data locally, then send the data over radio to the chase car where a second backup could be made. The radio integration didn't work and there was no time for testing.

Data collection begins on car start, the Raspberry Pi listens for all CAN messages and stores them. Each one is labeled with a CAN ID that is later used to sort into a more readable format

Collected Data:\
Data can be found here: [https://purdue0-my.sharepoint.com/personal/saschaef\_purdue\_edu/\_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fsaschaef%5Fpurdue%5Fedu%2FDocuments%2FASC%20Race%20Data\&ga=1](https://purdue0-my.sharepoint.com/personal/saschaef\_purdue\_edu/\_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fsaschaef%5Fpurdue%5Fedu%2FDocuments%2FASC%20Race%20Data\&ga=1)

The data in the link is the data from the race with most small files (under 5 minutes) removed. We have all data in another folder shared in the GitHub most of this is useless as there is little to relate the data to.

**Data Format:**\
Can dumps are created which are ran through the can decoder to create TSV files that are separated out for each can message. Once decoded a folder of the format "candump-2024-07-21T13\_14\_30.2456572Z" is created\
(   Label   )(       Date    )(    Run#     )(Random?)

In each candump folder all messages are displayed (around 50), example "0x400\_WaveSculptor.Broadcast.Identification"\
(Address)(     Device     )(          Description            )

Each file consists of a header with data type/description, and units if necessary. The first column is the time delta. The first row is the time delta off the minute before, then the delta between each message.\
There are two main types of messages, data messages and status messages. These files are not exclusive to each other and are often combined. The status messages set flags for boolean logic typically for errors or lights.
