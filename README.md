# homebridge-aircontrol-mini

A [HomeBridge Plugin](https://github.com/nfarina) making the TFA-Dostmann AirControl Mini CO2 measurment USB device availible in HomeKit.

## Installation


```
sudo apt-get install build-essential libudev-dev
sudo npm install -g homebridge-aircontrol-mini
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