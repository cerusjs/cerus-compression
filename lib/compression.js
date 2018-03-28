var zlib = require("zlib");

/**
 * @class compression
 */
class compression {
	constructor(cerus, type) {
		this._settings = new settings();
		this._cerus = cerus;

		this._settings.type(type);
	}

	/**
	 * @function settings
	 */
	settings() {
		return this._settings;
	}

	/**
	 * @function open
	 */
	open(opts) {
		var name = "create" + upper_first(return_type(options.type));
		var options = Object.assign({}, this.settings()._settings, opts);

		this._stream = zlib[name](options);
	}

	/**
	 * @function events
	 */
	events() {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		return this._cerus.promise(function(event) {
			this._stream.on("drain", function() {
				event("drain");
			});

			this._stream.on("error", function(err) {
				event("error", err);
			});

			this._stream.on("finish", function() {
				event("finish");
			});

			this._stream.on("pipe", function() {
				event("pipe");
			});

			this._stream.on("unpipe", function() {
				event("unpipe");
			});
		});
	}

	/**
	 * @function stream
	 */
	stream() {
		return this._stream;
	}

	/**
	 * @function write
	 */
	write(chunk, encoding) {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		if(typeof chunk !== "string" && !Buffer.isBuffer(chunk)) {
			throw new TypeError("the argument chunk must be a string or buffer");
		}

		return this._cerus.promise(function(event) {
			this._.write(chunk, encoding, function() {
				event("written");
			});
		});
	}

	/**
	 * @function end
	 */
	end(chunk, encoding) {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		return this._cerus.promise(function(event) {
			this._stream.end(chunk, encoding, function() {
				event("ended");
			});
		});
	}

	/**
	 * @function cork
	 */
	cork() {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		this._stream.cork();
	}

	/** 
	 * @function uncork
	 */
	uncork() {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		this._stream.uncork();
	}

	/**
	 * @function destroy
	 */
	destroy(error) {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		this._stream.destroy(error);
	}

	/**
	 * @function compress
	 */
	compress(data, opts = {}) {
		var options = Object.assign({}, this.settings()._settings, opts);
		var name = return_type(options.type);

		if(typeof data !== "string" && !Buffer.isBuffer(data)) {
			throw new TypeError("argument data must be a string or a buffer");
		}

		return this._cerus.promise(function(event) {
			var func = function(err, res) {
				if(err) {
					return event("error", err);
				}

				event("data", res);
			};

			zlib[name](Buffer.from(data, opts["encoding"]), options, func);
		});
	}
}

module.exports = compression;

/**
 * @class settings
 */
class settings {
	constructor() {
		this._settings = {
			flush: zlib.Z_NO_FLUSH,
			finishFlush: zlib.Z_FINISH,
			chunkSize: zlib.Z_DEFAULT_CHUNK,
			level: zlib.Z_DEFAULT_COMPRESSION,
			memLevel: zlib.Z_DEFAULT_MEMLEVEL,
			strategy: zlib.Z_DEFAULT_STRATEGY,
			windowBits: zlib.Z_DEFAULT_WINDOWBITS,
			type: "deflate"
		};
	}

	/**
	 * @function flush
	 */
	flush(flush) {
		if(typeof flush === "number") {
			this._settings["flush"] = flush;
		}

		return this._settings["flush"];
	}

	/**
	 * @function finish
	 */
	finish(finish) {
		if(typeof finish === "number") {
			this._settings["finishFlush"] = finish;
		}

		return this._settings["finishFlush"];
	}

	/**
	 * @function chunk
	 */
	chunk(chunk) {
		if(typeof chunk === "number") {
			this._settings["chunkSize"] = chunk;
		}

		return this._settings["chunkSize"];
	}

	/**
	 * @function level
	 */
	level(level) {
		if(typeof level === "number") {
			this._settings["level"] = level;
		}

		return this._settings["level"];
	}

	/**
	 * @function memory
	 */
	memory(memory) {
		if(typeof memory === "number") {
			this._settings["memLevel"] = memory;
		}

		return this._settings["memLevel"];
	}

	/**
	 * @function strategy
	 */
	strategy(strategy) {
		if(typeof strategy === "number") {
			this._settings["strategy"] = strategy;
		}

		return this._settings["strategy"];
	}

	/**
	 * @function window
	 */
	window(window) {
		if(typeof window === "number") {
			this._settings["windowBits"] = window;
		}

		return this._settings["windowBits"];
	}

	/**
	 * @function type
	 */
	type(type) {
		if(typeof type === "number") {
			this._settings["type"] = type;
		}

		return this._settings["type"];
	}
}

var return_type = function return_type_for_name(type) {
	switch(type) {
		case "deflate":
			return "deflate";
		case "deflateraw":
			return "deflateRaw";
		case "gunzip":
			return "gunzip";
		case "gzip":
			return "gzip";
		case "inflate":
			return "inflate";
		case "inflateraw":
			return "inflateRaw";
		case "unzip":
			return "unzip";
		default:
			throw new Error("the specified type " + type + " doesn't exist");
	}
};

var upper_first = function upper_case_first_letter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
