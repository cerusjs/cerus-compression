module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];
	self.dependencies = [
		"cerus-promise"
	];

	var cerus;
	var compression = require("./lib/compression");
	var zlib = require("zlib");

	self.init_ = function(cerus_) {
		cerus = cerus_;
	}

	self.compression = function(type) {
		return compression(cerus, type);
	}

	return self;
}