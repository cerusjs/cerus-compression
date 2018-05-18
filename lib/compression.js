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
	 * This function will end the compression stream. While ending the stream you can also supply 
	 * the last data that will be written to the stream. The data you want to write to the stream
	 * is specified with the chunk parameter. You can also set the encoding it will be written in
	 * using the encoding parameter. This function will throw an error when the stream hasn't been
	 * opened yet when this function is called. This function will also return a promise that calls
	 * the "ended" event when the stream has succesfully ended and all the data has been flushed.
	 * @example
	 * var compression = cerus.compression();
	 * compression.open();
	 * compression.end("data");
	 * // -> this function will write the string "data" to the compression stream end then end the stream
	 * @summary Ends the compression stream after writing data.
	 * @param {String|Buffer} chunk The last data to write to the stream.
	 * @param {String} (encoding) The encoding the data will be written in.
	 * @return {Promise} This function will return a promise.
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
	 * With this function you can force the compression stream to buffer all the data to the 
	 * memory. By doing this a situation can be avoided where a backup would be created when 
	 * a lot of small chunks of data are added to the internal buffer. When this happens 
	 * performance will be heavily impacted. This behaviour is stopped using the .uncork() 
	 * function or when the stream is ended. This function will throw an error when the stream 
	 * hasn't been started yet.
	 * @summary Forces the compression stream to write all data to the memory.
	 * @function cork
	 */
	cork() {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		this._stream.cork();
	}

	/** 
	 * Using this function you can stop the behaviour that was started using the .cork() method.
	 * This can also be done by ending the compression stream. This function will throw an error 
	 * when the stream hasn't been started yet.
	 * @summary Stops forcing the compression stream to write all data to the memory.
	 * @function uncork
	 */
	uncork() {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		this._stream.uncork();
	}

	/**
	 * With this function you can destroy the compression stream. Destroying it is basically 
	 * ending it with a possible error. This error can be inserted using the error parameter. You 
	 * can get this error from the "error" event. This function will throw an error when the stream
	 * hasn't started yet.
	 * @example
	 * var compression = cerus.compression();
	 * compression.open();
	 * compression.destroy(new Error("destroyed"));
	 * // -> this function will destroy the compression stream and throw the error "destroyed"
	 * @summary Destroys the compression stream.
	 * @param {Error} (error) The error that will be used in the "error" event.
	 * @function destroy
	 */
	destroy(error) {
		if(this._stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		this._stream.destroy(error);
	}

	/**
	 * With this function you can asynchronously compress data. This means this function will 
	 * immediately compress the data instead of having to use a stream. The data you want to 
	 * compress is specified with the data parameter. You can also override the settings using the 
	 * opts parameter. This function will return a promise that calls the "data" event when the 
	 * data has been compressed, with the data as first argument, and the "error" event when there
	 * was an error while compressing the data.
	 * @example
	 * var compression = cerus.compression();
	 * compression.compress("example string");
	 * // -> this function will compress the string "example string"
	 * @summary Asynchronously compresses the inserted data.
	 * @param {String|Buffer} data The data that has to be compressed.
	 * @param {Object} (opts) The settings you want to override.
	 * @param {Object} (opts.encoding) The encoding you've used for the buffer.
	 * @return {Promise} This function will return a promise.
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

	constants() {
		if(this.constants === undefined) {
			this.constants = new constants();
		}

		return this.constants;
	}
}

module.exports = compression;

/**
 * This is the settings class. With this class you can change the default options that will be used
 * for compressing the data that is in the stream.
 * @class settings
 * @id compression.settings
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
	 * This is the setter and getter for the flush setting. The flush setting sets how much of the data 
	 * needs to be flushed. The default value is NO_FLUSH, meaning there will be no flushes.
	 * @summary The setter/getter for the flush setting.
	 * @param {Number} (flush) The new flush setting.
	 * @return {Number} The flush setting.
	 * @function flush
	 */
	flush(flush) {
		if(typeof flush === "number") {
			this._settings["flush"] = flush;
		}

		return this._settings["flush"];
	}

	/**
	 * This is the setter and getter for the finish setting. The finish setting sets what type of flush 
	 * needs to be used when the compression is done. By default this is FINISH, meaning all 
	 * remaining data will be flushed.
	 * @summary The setter/getter for the finish setting.
	 * @param {Number} (finish) The new finish setting.
	 * @return {Number} The finish setting.
	 * @function finish
	 */
	finish(finish) {
		if(typeof finish === "number") {
			this._settings["finishFlush"] = finish;
		}

		return this._settings["finishFlush"];
	}

	/**
	 * This is the setter and getter for the chunk setting. The chunk setting sets what size a 
	 * chunk is. That size will than be used during the compression. By default the chunk size is 
	 * DEFAULT_CHUNK, which is 16*1024 bytes.
	 * @summary The setter/getter for the chunk setting.
	 * @param {Number} (chunk) The new chunk setting.
	 * @return {Number} The chunk setting.
	 * @function chunk
	 */
	chunk(chunk) {
		if(typeof chunk === "number") {
			this._settings["chunkSize"] = chunk;
		}

		return this._settings["chunkSize"];
	}

	/**
	 * This is the setter and getter for the level setting. The level setting sets the level of 
	 * compression that will be used. This setting will only work for compression and not for 
	 * decompression. By default the compression level is set to DEFAULT_COMPRESSION.
	 * @summary The setter/getter for the level setting.
	 * @param {Number} (level) The new level setting.
	 * @return {Number} The level setting.
	 * @function level
	 */
	level(level) {
		if(typeof level === "number") {
			this._settings["level"] = level;
		}

		return this._settings["level"];
	}

	/**
	 * This is the setter and getter for the memory setting. The memory setting sets the amount of 
	 * memory that may be allocated to compressing the data. By default the memory level is set to 
	 * DEFAULT_MEMLEVEL.
	 * @summary The setter/getter for the memory setting.
	 * @param {Number} (memory) The new memory setting.
	 * @return {Number} The memory setting.
	 * @function memory
	 */
	memory(memory) {
		if(typeof memory === "number") {
			this._settings["memLevel"] = memory;
		}

		return this._settings["memLevel"];
	}

	/**
	 * This is the setter and getter for the compression strategy. The strategy setting sets the 
	 * strategy type that will be used while compressing the inserted data. By default this is set 
	 * to DEFAULT_STRATEGY.
	 * @summary The setter/getter for the strategy setting.
	 * @param {Number} (strategy) The new strategy setting.
	 * @return {Number} The strategy setting.
	 * @function strategy
	 */
	strategy(strategy) {
		if(typeof strategy === "number") {
			this._settings["strategy"] = strategy;
		}

		return this._settings["strategy"];
	}

	/**
	 * @function windowbits
	 */
	windowbits(windowbits) {
		if(typeof windowbits === "number") {
			this._settings["windowBits"] = windowbits;
		}

		return this._settings["windowBits"];
	}

	/**
	 * This is the setter and getter for the compression type. With the type setting you can change
	 * if the class is used to compress or decompress data. You can also change what type of 
	 * compression to use. There are: deflate and inflate, deflateraw and inflateraw, gzip and 
	 * gunzip and there is also unzip to decompress data. By default this setting is DEFLATE.
	 * @summary The setter/getter for the type setting.
	 * @param {Number} (type) The new type setting.
	 * @return {Number} The type setting.
	 * @function type
	 */
	type(type) {
		if(typeof type === "number") {
			this._settings["type"] = type;
		}

		return this._settings["type"];
	}
}

/**
 * @class constants
 * @id compression.constants
 */
class constants {
	flush() {
		if(this.flush === undefined) {
			this.flush = new constants_flush();
		}

		return this.flush;
	}

	codes() {
		if(this.codes === undefined) {
			this.codes = new constants_codes();
		}

		return this.codes;
	}

	level() {
		if(this.level === undefined) {
			this.level = new constants_level();
		}

		return this.level;
	}

	strategy() {
		if(this.strategy === undefined) {
			this.strategy = new constants_strategy();
		}

		return this.strategy;
	}

	windowbits() {
		if(this.windowbits === undefined) {
			this.windowbits = new constants_windowbits();
		}

		return this.windowbits;
	}

	memory() {
		if(this.memory === undefined) {
			this.memory = new constants_memory();
		}

		return this.memory;
	}

	chunk() {
		if(this.chunk === undefined) {
			this.chunk = new constants_chunk();
		}

		return this.chunk;
	}
}

/**
 * @class flush
 * @id compression.constants.flush
 */
class constants_flush {
	no() {
		return zlib.constants.Z_NO_FLUSH;
	}

	partial() {
		return zlib.constants.Z_PARTIAL_FLUSH;
	}

	sync() {
		return zlib.constants.Z_SYNC_FLUSH;
	}

	full() {
		return zlib.constants.Z_FULL_FLUSH;
	}

	finish() {
		return zlib.constants.Z_FINISH;
	}

	block() {
		return zlib.constants.Z_BLOCK;
	}

	trees() {
		return zlib.constants.Z_TREES;
	}
}

/**
 * @class flush
 * @id compression.constants.codes
 */
class constants_codes {
	ok() {
		return zlib.constants.Z_OK;
	}

	streamend() {
		return zlib.constants.Z_STREAM_END;
	}

	needdict() {
		return zlib.constants.Z_NEED_DICT;
	}

	errno() {
		return zlib.constants.Z_ERRNO;
	}

	streamerror() {
		return zlib.constants.Z_STREAM_ERROR;
	}

	dataerror() {
		return zlib.constants.Z_DATA_ERROR;
	}

	memerror() {
		return zlib.constants.Z_MEM_ERROR;
	}

	buferror() {
		return zlib.constants.Z_BUF_ERROR;
	}

	versionerror() {
		return zlib.constants.Z_VERSION_ERROR;
	}
}

/**
 * @class flush
 * @id compression.constants.level
 */
class constants_level {
	no() {
		return zlib.constants.Z_NO_COMPRESSION;
	}

	speed() {
		return zlib.constants.Z_BEST_SPEED;
	}

	compression() {
		return zlib.constants.Z_BEST_COMPRESSION;
	}

	default() {
		return zlib.constants.Z_DEFAULT_COMPRESSION;
	}
}

/**
 * @class flush
 * @id compression.constants.strategy
 */
class constants_strategy {
	filtered() {
		return zlib.constants.Z_FILTERED;
	}

	huffman() {
		return zlib.constants.Z_HUFFMAN_ONLY;
	}

	rle() {
		return zlib.constants.Z_RLE;
	}

	fixed() {
		return zlib.constants.Z_FIXED;
	}

	default() {
		return zlib.constants.Z_DEFAULT_STRATEGY;
	}
}

/**
 * @class flush
 * @id compression.constants.windowbits
 */
class constants_windowbits {
	min() {
		return zlib.constants.Z_MIN_WINDOWBITS;
	}

	max() {
		return zlib.constants.Z_MAX_WINDOWBITS;
	}

	default() {
		return zlib.constants.Z_DEFAULT_WINDOWBITS;
	}
}

/**
 * @class flush
 * @id compression.constants.memory
 */
class constants_memory {
	min() {
		return zlib.constants.Z_MIN_MEMLEVEL;
	}

	max() {
		return zlib.constants.Z_MAX_MEMLEVEL;
	}

	default() {
		return zlib.constants.Z_DEFAULT_MEMLEVEL;
	}
}

/**
 * @class flush
 * @id compression.constants.chunk
 */
class constants_chunk {
	min() {
		return zlib.constants.Z_MIN_CHUNK;
	}

	max() {
		return zlib.constants.Z_MAX_CHUNK;
	}

	default() {
		return zlib.constants.Z_DEFAULT_CHUNK;
	}
}

var return_type = function return_type_for_name(type) {
	switch(type.toLowerCase()) {
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
