var Service, Characteristic;

const Co2Monitor = require("co2-monitor");
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

  // Set up CO2
  let monitor = co2Monitor;
  this.co2monitor = monitor;
  this.co2service = new Service.CarbonDioxideSensor(this.name);

  this.co2monitor.on("co2", co2 => {
    if (that.co2 == null || that.co2 == undefined) {
      that.log(that.name, "Recieved first CO2 value at ", co2);
      that.co2_peak = co2;
    } else if (co2 > that.co2_peak) {
      that.co2_peak = co2;
    }
    that.co2 = co2;
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
    if (that.temperature == null || that.temperature == undefined) {
      that.log(that.name, "Recieved first temperature value at ", temp);
    }
    that.temperature = temp;
  });

  this.temperatureService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on("get", this.getCurrentTemperature.bind(this));

  // Connection
  this.co2monitor.on("connected", device => {
    monitor.startTransfer();
    that.log(that.name, "Connected, recieving data…");
  });

  this.co2monitor.connect();
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
  var result = this.co2 > 1000
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
