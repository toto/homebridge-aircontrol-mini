# homebridge-aircontrol-mini

A [HomeBridge Plugin](https://github.com/nfarina) making the TFA-Dostmann AirControl Mini CO2 measurment USB device availible in HomeKit.

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


## Sample Config (Excerpt)

Configured as part of your homebridge configuration.

The only config parameter needed is `name`. In addition to this you need to connect the device to your machine running homebridge. Because USB access (using libusb) is required superuser access might be required.


```
{
  "bridge": {
    …
  },
  …
  "accessories": [
    {
      "accessory": "aircontrol-mini",
      "name": "Living Room CO2"
    }
  ],
	…
}

```