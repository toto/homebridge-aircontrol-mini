var Service, Characteristic;

var co2monitor    = require('co2-monitor');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-aircontrol-mini", "aircontrol-mini", CO2Accessory);
}