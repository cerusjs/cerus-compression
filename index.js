module.exports = function() {
	var self = {};

	var package = require("./package.json");
	
	self.name = package["name"];
	self.version = package["version"];
	self.dependencies = [
		"cerus",
		"cerus-promise",
		"cerus-settings"
	];

	var cerus;
	var compression = require("./lib/compression");
	var zlib = require("zlib");

	self.init_ = function(cerus_) {
		cerus = cerus_;

		cerus.settings().setting("compression.on", true);
		cerus.settings().setting("compression.chunk", zlib.Z_DEFAULT_CHUNK);
		cerus.settings().setting("compression.level", zlib.Z_DEFAULT_COMPRESSION);
		cerus.settings().setting("compression.memory", zlib.Z_DEFAULT_MEMLEVEL);
		cerus.settings().setting("compression.strategy", zlib.Z_DEFAULT_STRATEGY);
		cerus.settings().setting("compression.flush", zlib.Z_NO_FLUSH);
		cerus.settings().setting("compression.finish", zlib.Z_FINISH);
		cerus.settings().setting("compression.threshold", 1000);
		cerus.settings().setting("compression.window", zlib.Z_DEFAULT_WINDOWBITS);
		cerus.settings().setting("compression.type", "gzip");
	}

	self.compression = function(type) {
		return compression(cerus, type);
	}

	return self;
}