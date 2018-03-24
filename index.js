module.exports = function() {
	var plugin = {};
	var package = require("./package.json");
	var cerus;
	var compression = require("./lib/compression");
	
	plugin.name = package["name"];
	plugin.version = package["version"];
	plugin.dependencies = [
		"cerus-promise"
	];

	plugin._init = function(cerus_) {
		cerus = cerus_;
	}

	plugin.compression = function(type) {
		return new compression(cerus, type);
	}

	return plugin;
}