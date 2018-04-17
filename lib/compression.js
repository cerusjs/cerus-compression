var zlib = require("zlib");

/**
 * This is the compression class. It'll help you with compressing data sync or async. More 
 * information about this compression can be found in the tutorials.
 * @class compression
 */
class compression {
	constructor(cerus, type) {
		this._settings = new settings();
		this._cerus = cerus;

		this._settings.type(type);
	}

	/**
	 * This function returns the settings class. With this class you can change the settings for 
	 * how the data will be compressed. You can also change the compression type with this class.
	 * @summary Returns the settings class.
	 * @function settings
	 */
	settings() {
		return this._settings;
	}

	/**
	 * With this function you can open the compression stream. Opening it means you can start 
	 * writing data, which will be compressed. You can also add the options you want. They will be 
	 * overwritten by the settings if you don't add them.
	 * @summary Opens the compression stream.
	 * @param {Object} (opts) The options for opening the stream.
	 * @function open
	 */
	open(opts) {
		var name = "create" + upper_first(return_type(options.type));
		var options = Object.assign({}, this.settings()._settings, opts);

		this._stream = zlib[name](options);
	}

	/**
	 * This function returns a promise that will call a number of events. The "drain" event is 
	 * called when something has been written to the stream and the stream is ready to be 
	 * written to again. The "error" event is called when there was an error somewhere in the 
	 * stream. The "finish" event is called when the compression.end() function has been called.
	 * The "pipe" event is called when the .pipe() function is used on a readable stream and the 
	 * "unpipe" event when the .unpipe() function is used. This function will throw an error when
	 * when the stream has not been opened yet.
	 * @summary Returns a promise that's called for every event.
	 * @returns {Promise} Returns a promise.
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
	 * This function will return the compression stream. It will be undefined until you've opened 
	 * it. This stream is used for async compression. Use .compress() when you want to compress it
	 * synchronously. 
	 * @summary Returns the compression stream.
	 * @return {Stream} The compression stream.
	 * @function stream
	 */
	stream() {
		return this._stream;
	}

	/**
	 * With this function you can write to the compression stream. What you write to the 
	 * compression stream is defined with the chunk parameter. You can also change the encoding
	 * with the encoding parameter. There will be an error of the stream has not been opened yet.
	 * This function will return a promise that calls the "written" event when the data has been 
	 * written to the compression stream.
	 * @example
	 * var compression = cerus.compression();
	 * compression.open();
	 * compression.write("data");
	 * // -> this function will write the string "data" to the compression stream
	 * @summary Writes data to the compression stream.
	 * @param {String|Buffer} chunk The data to write to the stream.
	 * @param {String} (encoding) The encoding the data will be written in.
	 * @return {Promise} This function will return a promise.
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
