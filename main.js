var Service, Characteristic;

const co2monitor = require('co2-monitor');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-aircontrol-mini", "aircontrol-mini", CO2Accessory);
}


function CO2Accessory(log, config) {
  var that = this;
  
  this.log = log;
  this.name = config["name"];

  // Set up CO2
  this.co2monitor = co2monitor;
  this.co2service = new Service.CarbonDioxideSensor(this.name);

  this.co2Monitor.on('co2', (co2) => {
      console.log('co2: ' + co2);
	  	that.co2 = co2;
  });
  
  this.co2service
    .getCharacteristic(Characteristic.CarbonDioxideLevel)
    .on('get', this.getLevel.bind(this));

  this.co2service
    .getCharacteristic(Characteristic.CarbonDioxideDetected)
    .on('get', this.getDetected.bind(this));
	
  // Set up Temperature Service
	this.temperatureService = new Service.TemperatureSensor(this.name);
	
  this.co2Monitor.on('temp', (temp) => {
      console.log('temp (C): ' + temp);
	  	that.temperature = temp;
  });
	
	this.temperatureService
		.getCharacteristic(Characteristic.CurrentTemperature)
	.on('get', this.getCurrentTemperature.bind(this));
	
}

CO2Accessory.prototype.getLevel = function(callback) {
    this.log(this.name, " - CO2 : ", this.co2);
    callback(null, this.co2);
}

CO2Accessory.prototype.getDetected = function(callback) {
    var result = (this.co2 > 1000 ? Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL : Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL);
    callback(null, result);
}

CO2Accessory.prototype.getCurrentTemperature = function(callback) {
    this.log(this.name, " - Temperature (C) : ", this.temperature);
    callback(null, result);
}

CO2Accessory.prototype.getServices = function() {
  return [this.co2service, this.temperatureService];
}
