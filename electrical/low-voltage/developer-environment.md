## Development Environment

### Integrated Development Environment
[Visual Studio Code](https://code.visualstudio.com/) is the preferred integrated development environment for the team.

#### PlatformIO Extension
[PlatformIO]() is a development platform for working with a wide array of microcontrollers. To use PlatformIO, download the PlatformIO Visual Studio Code extension.

PlatformIO manages toolchains (including compilers, build systems, and software deployment) individually for each project, allowing for easy project setup. To set up a project using PlatformIO, place the corresponding `platformio.ini` configuration file for the project's microcontroller in the project root.

{% tabs %}

{% tab title="Raspberry Pi Pico" %} Here are the instructions for Windows {% endtab %}

```ini
[env:rpipico2]
platform = https://github.com/maxgerhardt/platform-raspberrypi
board = rpipico2
framework = picosdk
```

{% tab title="Teensy" %} Here are the instructions for macOS {% endtab %}

```ini
[env:teensy40]
platform = teensy
board = teensy40
framework = arduino
```

{% endtabs %}

### Version Control
[Git](https://git-scm.com/) is the version control software used on the team.

### Code Hosting
[GitHub](https://github.com/) is the code host for the team. The team has a [GitHub organization](https://github.com/Purdue-Solar) which hosts the team's code, PCB designs, documentation, and other team resources.