# homebridge-aircontrol-mini

A [HomeBridge Plugin](https://github.com/nfarina) making the [TFA-Dostmann AirCO2ntrol Mini](https://www.amazon.co.uk/TFA-Dostmann-AirCO2NTROL-Mini-Monitor/dp/B00TH3OW4Q) CO2 Monitor measurment USB device availible in [HomeKit](https://developer.apple.com/homekit/).

## Installation

For use on an Ubuntu/Debian style Linux: 

```
sudo apt-get install build-essential libudev-dev
sudo npm install -g --unsafe-perm homebridge-aircontrol-mini
```

To allow homebridge to run without beeing root or using sudo a udev Rule needs to be added. 

Create `/etc/udev/rules.d/23-homebridge.rules` and put in the following line, where you replace `homebridge` with the group of the user running homebridge on your system (e.g. `pi` on a raspian):

```
SUBSYSTEM=="usb", ATTR{idVendor}=="04d9", ATTR{idProduct}=="a052", GROUP="homebridge", MODE="0664"
```

Afterwards reload the rules with `udevadm control --reload` and replug the USB plug of your AirControl Mini.

## Sample Config (Excerpt)

Configured as part of your homebridge configuration.

- `accessory`: Needs to be `aircontrol-mini`
- `name`: Required, String; You need to configure the `name` of your accessory. 
- `co2_warning_level`: Optional, Number, Default 1200; Configure the level (in ppm) at which the CO2 is detected as abnormal (default 1200ppm, same as red LED level according to the device manual). 

In addition to this you need to connect the device to your machine running homebridge. 

```
{
  "bridge": {
    …
  },
  …
  "accessories": [
    {
      "accessory": "aircontrol-mini",
      "name": "Living Room CO2",
      "co2_warning_level": 1200
    }
  ],
	…
}

```
