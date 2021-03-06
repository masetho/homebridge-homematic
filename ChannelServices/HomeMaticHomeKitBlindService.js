'use strict';

var HomeKitGenericService = require('./HomeKitGenericService.js').HomeKitGenericService;
var util = require("util");


function HomeMaticHomeKitBlindService(log,platform, id ,name, type ,adress,special, cfg, Service, Characteristic) {
    HomeMaticHomeKitBlindService.super_.apply(this, arguments);
}

util.inherits(HomeMaticHomeKitBlindService, HomeKitGenericService);


HomeMaticHomeKitBlindService.prototype.createDeviceService = function(Service, Characteristic) {

    var that = this;
    var blind = new Service["WindowCovering"](this.name);
    this.services.push(blind);

    var cpos = blind.getCharacteristic(Characteristic.CurrentPosition)

    .on('get', function(callback) {
      that.query("LEVEL",function(value){
       if (callback) callback(null,value);
      });
    }.bind(this));

    this.currentStateCharacteristic["LEVEL"] = cpos;
    cpos.eventEnabled = true;


    var tpos = blind.getCharacteristic(Characteristic.TargetPosition)
    
    .on('get', function(callback) {
	if (that.state["LEVEL"] != undefined ) {
		callback(null,that.state["LEVEL"]);
	} else {
      		that.query("LEVEL",function(value){
			if (callback) {
				callback(null,value);
			}
		});
	}
    }.bind(this))
    
    .on('set', function(value, callback) {
      that.delayed("set", "LEVEL", value, 750);
      callback();
    }.bind(this));

    var pstate = blind.getCharacteristic(Characteristic.PositionState)
	
	.on('get', function(callback) {
      that.query("DIRECTION",function(value){
       if (callback) {
          if (value!=undefined) {
            callback(null,value);
          } else {
            callback(null,"0");
          }
                
       }
      });
    }.bind(this));
    
    this.currentStateCharacteristic["DIRECTION"] = pstate;
    pstate.eventEnabled = true;

    this.addValueMapping("DIRECTION",0,2);
    this.addValueMapping("DIRECTION",1,1);
    this.addValueMapping("DIRECTION",2,0);
    this.addValueMapping("DIRECTION",3,2);

    this.remoteGetValue("LEVEL");
    this.remoteGetValue("DIRECTION");



}

HomeMaticHomeKitBlindService.prototype.endWorking=function()  {
 this.remoteGetValue("LEVEL");
}


module.exports = HomeMaticHomeKitBlindService; 