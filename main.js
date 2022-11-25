var Service, Characteristic;

const Co2Monitor = require("@jaller94/node-co2-monitor");
let co2Monitor = new Co2Monitor();

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory(
    "homebridge-aircontrol-mini",
    "aircontrol-mini",
    CO2Accessory
  );
};

function CO2Accessory(log, config) {
  var that = this;

  this.log = log;
  this.name = config["name"];
  this.co2_warning_level = config["co2_warning_level"];
  if (typeof(this.co2_warning_level) != "number") {
      this.co2_warning_level = 1200; // the manual says the RED level is at 1200ppm
  }

  // Set up CO2
  let monitor = co2Monitor;
  this.co2monitor = monitor;
  this.co2service = new Service.CarbonDioxideSensor(this.name);

  this.co2monitor.on("co2", co2 => {
    that.log(that.name, "CO2 (ppm):", co2);
    if (!that.co2_peak || co2 > that.co2_peak) {
      that.log(that.name, "CO2 Peak (ppm):", co2);
      that.co2_peak = co2;
      that.co2service.setCharacteristic(Characteristic.CarbonDioxidePeakLevel, co2);
    }
    that.co2 = co2;

    var result = that.co2 > that.co2_warning_level
                    ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL
                    : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;

    that.co2service.setCharacteristic(Characteristic.CarbonDioxideLevel, co2);
    that.co2service.setCharacteristic(Characteristic.CarbonDioxideDetected, result);
  });

  this.informationService = new Service.AccessoryInformation();
  this.informationService.setCharacteristic(
    Characteristic.Manufacturer,
    "TFA-Dostmann"
  );
  this.informationService.setCharacteristic(
    Characteristic.Model,
    "AirControl Mini"
  );

  this.co2service
    .getCharacteristic(Characteristic.CarbonDioxideLevel)
    .on("get", this.getLevel.bind(this));

  this.co2service
    .getCharacteristic(Characteristic.CarbonDioxideDetected)
    .on("get", this.getDetected.bind(this));

  this.co2service
    .getCharacteristic(Characteristic.CarbonDioxidePeakLevel)
    .on("get", this.getPeakLevel.bind(this));

  // Set up Temperature Service
  this.temperatureService = new Service.TemperatureSensor(this.name);

  this.co2monitor.on("temp", temp => {
    that.log(that.name, "Temperature (C):", temp);
    that.temperature = temp;
    that.temperatureService.setCharacteristic(Characteristic.CurrentTemperature, Number.parseFloat(temp));
  });

  this.temperatureService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on("get", this.getCurrentTemperature.bind(this));

  // Connection
  this.co2monitor.connect(() => {
    that.log(that.name, "Connected, recieving data…");
    monitor.transfer();
  });
}

CO2Accessory.prototype.getLevel = function(callback) {
  if (this.co2 == null || this.co2 == undefined) {
    callback(null, null);
    return;
  }
  callback(null, this.co2);
};

CO2Accessory.prototype.getPeakLevel = function(callback) {
  if (this.co2_peak == null || this.co2_peak == undefined) {
    callback(null, null);
    return;
  }
  callback(null, this.co2_peak);
};

CO2Accessory.prototype.getDetected = function(callback) {
  if (this.co2 == null || this.co2 == undefined) {
    callback(null, null);
    return;
  }
  var result = this.co2 > this.co2_warning_level
    ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL
    : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;
  callback(null, result);
};

CO2Accessory.prototype.getCurrentTemperature = function(callback) {
  if (this.temperature == null || this.temperature == undefined) {
    callback(null, null);
    return;
  }
  callback(null, new Number(this.temperature));
};

CO2Accessory.prototype.getServices = function() {
  return [this.co2service, this.temperatureService, this.informationService];
};
