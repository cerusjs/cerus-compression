const zlib = require("zlib");
const constants = require("./constants");
const type_map = {
	deflate: "deflate",
	deflateraw: "deflateRaw",
	gunzip: "gunzip",
	gzip: "gzip",
	inflate: "inflate",
	inflateraw: "inflateRaw",
	unzip: "unzip"
};

/**
 * This is the compression class. It'll help you with compressing data sync or async. More 
 * information about this compression can be found in the tutorials.
 * @class compression
 */
module.exports = class compression {
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
	 * @param {Object} (options = {}) The options for opening the stream.
	 * @function open
	 */
	open(options = {}) {
		let _options = Object.assign({}, this.settings()._settings, options);
		let name = "create" + this._uppercase_first(this._return_type(_options.type));

		this._stream = zlib[name](this._map_options(_options));
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
		if(this._stream === undefined) throw new Error("the stream hasn't been opened yet");

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
		if(this._stream === undefined) throw new Error("the stream hasn't been opened yet");

		return this._cerus.promisify(this._stream.write(chunk, encoding));
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
		if(this._stream === undefined) throw new Error("the stream hasn't been opened yet");
		
		return this._cerus.promisify(this._stream.end(chunk, encoding));
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
		if(this._stream === undefined) throw new Error("the stream hasn't been opened yet");

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
		if(this._stream === undefined) throw new Error("the stream hasn't been opened yet");

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
		if(this._stream === undefined) throw new Error("the stream hasn't been opened yet");

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
	 * @param {Object} (options) The settings you want to override.
	 * @param {Object} (options.encoding) The encoding you've used for the buffer.
	 * @return {Promise} This function will return a promise.
	 * @function compress
	 */
	compress(data, options = {}) {
		let _options = Object.assign({}, this.settings()._settings, options);
		let name = this._return_type(_options.type);
		
		return this._cerus.promisify(zlib[name])(Buffer.from(data, options.encoding), this._map_options(_options));
	}

	/**
	 * This function returns the {@link compression.constants.constructor} class. If the class hasn't been 
	 * created yet, it will create it.
	 * @summary Returns the {@link compression.constants.constructor} class.
	 * @return {Class} Returns the constants class.
	 * @function constants
	 */
	constants() {
		return new constants();
	}

	_map_options({flush, finish, chunk, level, memory, strategy, windowbits}) {
		return {
			flush,
			finishFlush: finish,
			chunkSize: chunk,
			level,
			memLevel: memory,
			strategy,
			windowBits: windowbits
		};
	}

	_return_type(type) {
		let _type = type_map[type.toLowerCase()];

		if(_type === undefined) throw new Error("the specified type " + _type + " doesn't exist");

		return _type;
	}
	
	_uppercase_first(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}

/**
 * This is the settings class. With this class you can change the default options that will be used
 * for compressing the data that is in the stream.
 * @class compression.settings
 */
class settings {
	constructor() {
		this._settings = {
			flush: zlib.Z_NO_FLUSH,
			finish: zlib.Z_FINISH,
			chunk: zlib.Z_DEFAULT_CHUNK,
			level: zlib.Z_DEFAULT_COMPRESSION,
			memory: zlib.Z_DEFAULT_MEMLEVEL,
			strategy: zlib.Z_DEFAULT_STRATEGY,
			windowbits: zlib.Z_DEFAULT_WINDOWBITS,
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
		if(flush === undefined) return this._settings.flush;

		return this._settings.flush = flush;
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
		if(finish === undefined) return this._settings.finish;

		return this._settings.finish = finish;
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
		if(chunk === undefined) return this._settings.chunk;

		return this._settings.chunk = chunk;
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
		if(level === undefined) return this._settings.level;

		return this._settings.level = level;
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
		if(memory === undefined) return this._settings.memory;

		return this._settings.memory = memory;
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
		if(strategy === undefined) return this._settings.strategy;

		return this._settings.strategy = strategy;
	}

	/**
	 * This is the setter and getter for the windowbits. The windowbits setting sets the size of 
	 * the history buffer while compression. The higher this value, the more bytes will be kept in 
	 * memory while compressing.
	 * @summary The setter/getter for the windowbits setting.
	 * @param {Number} (windowbits) The new windowbits setting.
	 * @return {Number} The windowbits setting.
	 * @function windowbits
	 */
	windowbits(windowbits) {
		if(windowbits === undefined) return this._settings.windowbits;

		return this._settings.windowbits = windowbits;
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
		if(type === undefined) return this._settings.type;

		return this._settings.type = type;
	}
}