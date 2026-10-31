---
description: Software required to develop software and hardware on the team
---

# Required Software

## Integrated Development Environment

[Visual Studio Code](https://code.visualstudio.com/) is the preferred integrated development environment for the team.

### PlatformIO Extension

[PlatformIO](developer-environment.md) is a development platform for working with a wide array of microcontrollers. To use PlatformIO, download the [PlatformIO Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide).

PlatformIO manages toolchains (including compilers, build systems, and software deployment) individually for each project, allowing for easy project setup. To set up a project using PlatformIO, place the corresponding `platformio.ini` configuration file for the project's microcontroller in the project root.

{% tabs %}
{% tab title="Raspberry Pi Pico" %}
```ini
[env:rpipico2]
platform = https://github.com/maxgerhardt/platform-raspberrypi
board = rpipico2
framework = picosdk
```
{% endtab %}

{% tab title="Teensy" %}
```ini
[env:teensy40]
platform = teensy
board = teensy40
framework = arduino
```
{% endtab %}
{% endtabs %}

## PCB Design

[KiCAD](https://www.kicad.org/) is the electronic design automation software used for PCB design on the team.

## Version Control

[Git](https://git-scm.com/) is the version control software used on the team.

## Project Hosting

[GitHub](https://github.com/) is the code and PCB design host for the team. The team has a [GitHub organization](https://github.com/Purdue-Solar) which hosts the team's code, PCB designs, documentation, and other team resources.
