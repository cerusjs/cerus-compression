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
		if(typeof type === "number") {
			this._settings["type"] = type;
		}

		return this._settings["type"];
	}
}

/**
 * This is the constants class. It contains multiple classes with constants for the compression 
 * settings that are available in the settings class.
 * @class constants
 * @id compression.constants
 */
class constants {

	/**
	 * This function returns the constants_flush class. It contains the constants for the flush 
	 * setting.
	 * @summary Returns the contstants_flush class.
	 * @return {Class} The constants_flush class.
	 * @function flush
	 */
	flush() {
		if(this.flush === undefined) {
			this.flush = new constants_flush();
		}

		return this.flush;
	}

	/**
	 * This functions return the constants_codes class. It contains codes, like errors, the 
	 * compression class may return.
	 * @summary Returns the constants_codes class.
	 * @return {Class} The constants_codes class.
	 * @function codes
	 */
	codes() {
		if(this.codes === undefined) {
			this.codes = new constants_codes();
		}

		return this.codes;
	}

	/**
	 * This functions return the constants_level class. It contains the constants for the 
	 * compression level setting.
	 * @summary Returns the constants_level class.
	 * @return {Class} The constants_level class.
	 * @function level
	 */
	level() {
		if(this.level === undefined) {
			this.level = new constants_level();
		}

		return this.level;
	}

	/**
	 * This functions return the constants_strategy class. It contains the constants for the 
	 * compression strategy setting.
	 * @summary Returns the constants_strategy class.
	 * @return {Class} The constants_strategy class.
	 * @function strategy
	 */
	strategy() {
		if(this.strategy === undefined) {
			this.strategy = new constants_strategy();
		}

		return this.strategy;
	}

	/**
	 * This functions return the constants_windowbits class. It contains the constants for the 
	 * windowbits setting.
	 * @summary Returns the constants_windowbits class.
	 * @return {Class} The constants_windowbits class.
	 * @function windowbits
	 */
	windowbits() {
		if(this.windowbits === undefined) {
			this.windowbits = new constants_windowbits();
		}

		return this.windowbits;
	}

	/**
	 * This functions return the constants_memory class. It contains the constants for the memory
	 * level setting.
	 * @summary Returns the constants_memory class.
	 * @return {Class} The constants_memory class.
	 * @function memory
	 */
	memory() {
		if(this.memory === undefined) {
			this.memory = new constants_memory();
		}

		return this.memory;
	}

	/**
	 * This functions return the constants_chunk class. It contains the constants for the chunk size
	 * setting.
	 * @summary Returns the constants_chunk class.
	 * @return {Class} The constants_chunk class.
	 * @function chunk
	 */
	chunk() {
		if(this.chunk === undefined) {
			this.chunk = new constants_chunk();
		}

		return this.chunk;
	}
}

/**
 * This is the flush contants class. It contains constants that can be used in the flush setting.
 * @class flush
 * @id compression.constants.flush
 */
class constants_flush {
	/**
	 * This is the NO_FLUSH constant. This means the compression class won't flush it's data when 
	 * the flush setting is set to this.
	 * @summary Returns the NO_FLUSH constant.
	 * @returns {Constant} Z_NO_FLUSH
	 * @function no
	 */
	no() {
		return zlib.constants.Z_NO_FLUSH;
	}

	/**
	 * This is the PARTIAL_FLUSH constant. This means the compression class will only do a partial
	 * flush when the flush setting is set to this.
	 * @summary Returns the PARTIAL_FLUSH constant.
	 * @returns {Constant} Z_PARTIAL_FLUSH
	 * @function partial
	 */
	partial() {
		return zlib.constants.Z_PARTIAL_FLUSH;
	}

	/**
	 * This is the SYNC_FLUSH constant. This means the compression class will only flush if it 
	 * needs to sync up when the flush setting is set to this. This happens when new data is added 
	 * to the compression stream.
	 * @summary Returns the SYNC_FLUSH constant.
	 * @returns {Constant} Z_SYNC_FLUSH
	 * @function sync
	 */
	sync() {
		return zlib.constants.Z_SYNC_FLUSH;
	}

	/**
	 * This is the FULL_FLUSH constant. THis means the compression class will fully flush the 
	 * stream every time new data has been added.
	 * @summary Returns the FULL_FLUSH constant.
	 * @returns {Constant} Z_FULL_FLUSH
	 * @function full
	 */
	full() {
		return zlib.constants.Z_FULL_FLUSH;
	}

	/**
	 * This is the FINISH constant. This means the compression class will only do a flush when the 
	 * compression has been ended. 
	 * @summary Returns the FINISH constant.
	 * @returns {Constant} Z_FINISH
	 * @function finish
	 */
	finish() {
		return zlib.constants.Z_FINISH;
	}

	/**
	 * This is the BLOCK constant. This means the compression class will flush every time a new 
	 * block has been created. A block is a certain amount of data, which size depends on the 
	 * machine you're using.
	 * @summary Returns the BLOCK constant.
	 * @returns {Constant} Z_BLOCK
	 * @function block
	 */
	block() {
		return zlib.constants.Z_BLOCK;
	}

	/**
	 * This is the TREES constant. This means the compression class will only flush the tree. This 
	 * is a sort of dictionary that is used to compress the data.
	 * @summary Returns the TREES constant.
	 * @returns {Constant} Z_TREES_FLUSH
	 * @function trees
	 */
	trees() {
		return zlib.constants.Z_TREES;
	}
}

/**
 * This is the codes contants class. It contains possible error or messages that can be returned by
 * the compression class.
 * @class codes
 * @id compression.constants.codes
 */
class constants_codes {
	/**
	 * This is the OK code. This code means that the compression was succesful and that there was 
	 * no error while compressing.
	 * @summary Returns the OK code.
	 * @returns {Constant} Z_OK
	 * @function ok
	 */
	ok() {
		return zlib.constants.Z_OK;
	}

	/**
	 * This is the STREAM_END code. This code means that the stream has been enden but something is
	 * still trying to add data to the stream.
	 * @summary Returns the STREAM_END code.
	 * @returns {Constant} Z_STREAM_END
	 * @function streamend
	 */
	streamend() {
		return zlib.constants.Z_STREAM_END;
	}

	
	/**
	 * This is the NEED_DICT code. This code means that the compression stream was trying to 
	 * decompress something but couldn't find a dictionary. This is list of quick translations
	 * the decompression class uses to quickly decompress data.
	 * @summary Returns the NEED_DICT code.
	 * @returns {Constant} Z_NEED_DICT
	 * @function needdict
	 */
	needdict() {
		return zlib.constants.Z_NEED_DICT;
	}

	/**
	 * This is the ERRNO code. This code means that there was an error while flushing the data.
	 * @summary Returns the ERRNO code.
	 * @returns {Constant} Z_ERRNO
	 * @function errno
	 */
	errno() {
		return zlib.constants.Z_ERRNO;
	}

	/**
	 * This is the STREAM_ERROR code. This code means that there was an error while accessing a 
	 * file that needs to be written to or read from.
	 * @summary Returns the STREAM_ERROR code.
	 * @returns {Constant} Z_STREAM_ERROR
	 * @function streamerror
	 */
	streamerror() {
		return zlib.constants.Z_STREAM_ERROR;
	}
	
	/**
	 * This is the DATA_ERROR code. This code means that there was something that stopped the 
	 * stream while it was compressing or decompressing data.
	 * @summary Returns the DATA_ERROR code.
	 * @returns {Constant} Z_DATA_ERROR
	 * @function dataerror
	 */
	dataerror() {
		return zlib.constants.Z_DATA_ERROR;
	}

	/**
	 * This is the MEM_ERROR code. This code means that there was an error while allocating 
	 * memory to the compression or decompression process.
	 * @summary Returns the MEM_ERROR code.
	 * @returns {Constant} Z_MEM_ERROR
	 * @function memerror
	 */
	memerror() {
		return zlib.constants.Z_MEM_ERROR;
	}

	/**
	 * This is the BUF_ERROR code. This code means that there was an error while trying to write
	 * data to the buffer since it was full.
	 * @summary Returns the BUF_ERROR code.
	 * @returns {Constant} Z_BUF_ERROR
	 * @function buferror
	 */
	buferror() {
		return zlib.constants.Z_BUF_ERROR;
	}

	/**
	 * This is the VERSION_ERROR code. This code means that there was an error since the version 
	 * for zlib the user is using doesn't support the requested compression or decompression type.
	 * @summary Returns the VERSION_ERROR code.
	 * @returns {Constant} Z_VERSION_ERROR
	 * @function versionerror
	 */
	versionerror() {
		return zlib.constants.Z_VERSION_ERROR;
	}
}

/**
 * This is the compession level contants class. It contains constants that can be used in the level
 * setting.
 * @class level
 * @id compression.constants.level
 */
class constants_level {
	/**
	 * This is the NO_COMPRESSION constant. When it's used the compression class won't compress 
	 * anything.
	 * @summary Returns the NO_COMPRESSION constant.
	 * @returns {Constant} Z_NO_COMPRESSION
	 * @function no
	 */
	no() {
		return zlib.constants.Z_NO_COMPRESSION;
	}

	/**
	 * This is the BEST_SPEED constant. When it's used the compression class will compress with as
	 * fast as possible, meaning the compression won't be as good.
	 * @summary Returns the BEST_SPEED constant.
	 * @returns {Constant} Z_BEST_SPEED
	 * @function speed
	 */
	speed() {
		return zlib.constants.Z_BEST_SPEED;
	}

	/**
	 * This is the BEST_COMPRESSION constant. When it's used the compression class will compress 
	 * the data as much as possible. This will take more time than the other options.
	 * @summary Returns the BEST_COMPRESSION constant.
	 * @returns {Constant} Z_BEST_COMPRESSION
	 * @function compression
	 */
	compression() {
		return zlib.constants.Z_BEST_COMPRESSION;
	}
	
	/**
	 * This is the DEFAULT_COMPRESSION constant. When it's used the compression class will combine 
	 * speed with amount of compression to create the highest possible speed/compression ratio.
	 * @summary Returns the DEFAULT_COMPRESSION constant.
	 * @returns {Constant} Z_DEFAULT_COMPRESSION
	 * @function default
	 */
	default() {
		return zlib.constants.Z_DEFAULT_COMPRESSION;
	}
}

/**
 * This is the compession strategy contants class. It contains constants that can be used in the 
 * strategy setting.
 * @class strategy
 * @id compression.constants.strategy
 */
class constants_strategy {
	/**
	 * This is the FILTERED constant. This strategy is optimized for data that is produced by a 
	 * filter. Meaning it is one kind of data.
	 * @summary Returns the FILTERED constant.
	 * @returns {Constant} Z_FILTERED
	 * @function filtered
	 */
	filtered() {
		return zlib.constants.Z_FILTERED;
	}

	/**
	 * This is the HUFFMAN_ONLY constant. This strategy is optimized for data you don't 
	 * think contain any similar data, since it won't do any string matching.
	 * @summary Returns the HUFFMAN_ONLY constant.
	 * @returns {Constant} Z_HUFFMAN_ONLY
	 * @function huffman
	 */
	huffman() {
		return zlib.constants.Z_HUFFMAN_ONLY;
	}

	/**
	 * This is the RLE constant. This strategy is optimized for PNG images and is designed
	 * to be almost as fust as HUFFMAN_ONLY
	 * @summary Returns the RLE constant.
	 * @returns {Constant} Z_RLE
	 * @function rle
	 */
	rle() {
		return zlib.constants.Z_RLE;
	}

	/**
	 * This is the FIXED constant. This strategy is optimized for simpler applications and is 
	 * optimized for shorter strings, as it doesn't use Huffman's dynamic codes.
	 * @summary Returns the FIXED constant.
	 * @returns {Constant} Z_FIXED
	 * @function fixed
	 */
	fixed() {
		return zlib.constants.Z_FIXED;
	}

	/**
	 * This is the DEFAULT_STRATEGY constant. This strategy is optimized for normal data. It 
	 * combines Huffman's compression with the standard text compression. 
	 * @summary Returns the DEFAULT_STRATEGY constant.
	 * @returns {Constant} Z_DEFAULT_STRATEGY
	 * @function default
	 */
	default() {
		return zlib.constants.Z_DEFAULT_STRATEGY;
	}
}

/**
 * This is the windowbits contants class. It contains constants that can be used in the windowbits
 * setting.
 * @class windowbits
 * @id compression.constants.windowbits
 */
class constants_windowbits {
	/**
	 * This is the MIN_WINDOWBITS constant. It returns the minimal amount of windowbits that can be
	 * used for the compression and decompression.
	 * @summary Returns the MIN_WINDOWBITS constant.
	 * @returns {Constant} Z_MIN_WINDOWBITS
	 * @function min
	 */
	min() {
		return zlib.constants.Z_MIN_WINDOWBITS;
	}

	/**
	 * This is the MAX_WINDOWBITS constant. It returns the maximum amount of windowbits that can 
	 * be used for the compression and decompression.
	 * @summary Returns the MAX_WINDOWBITS constant.
	 * @returns {Constant} Z_MAX_WINDOWBITS
	 * @function max
	 */
	max() {
		return zlib.constants.Z_MAX_WINDOWBITS;
	}

	/**
	 * This is the DEFAULT_WINDOWBITS constant. It returns the default amount of windowbits that is 
	 * used for the compression and decompression.
	 * @summary Returns the DEFAULT_WINDOWBITS constant.
	 * @returns {Constant} Z_DEFAULT_WINDOWBITS
	 * @function default
	 */
	default() {
		return zlib.constants.Z_DEFAULT_WINDOWBITS;
	}
}

/**
 * This is the memory contants class. It contains constants that can be used in the memory level
 * setting.
 * @class memory
 * @id compression.constants.memory
 */
class constants_memory {
	/**
	* This is the MIN_MEMLEVEL constant. It returns the minimal amount of memory that can be used
	* for the compression and decompression.
	 * @summary Returns the MIN_MEMLEVEL constant.
	* @returns {Constant} Z_MIN_MEMLEVEL
	* @function min
	*/
	min() {
		return zlib.constants.Z_MIN_MEMLEVEL;
	}

	/**
	 * This is the MAX_MEMLEVEL constant. It returns the maximum amount of memory that can be used
	 * for the compression and decompression.
	 * @summary Returns the MAX_MEMLEVEL constant.
	 * @returns {Constant} Z_MAX_MEMLEVEL
	 * @function max
	 */
	max() {
		return zlib.constants.Z_MAX_MEMLEVEL;
	}

	/**
	 * This is the DEFAULT_MEMLEVEL constant. It returns the default amount of memory that is used
	 * for the compression and decompression.
	 * @summary Returns the DEFAULT_MEMLEVEL constant.
	 * @returns {Constant} Z_DEFAULT_MEMLEVEL
	 * @function default
	 */
	default() {
		return zlib.constants.Z_DEFAULT_MEMLEVEL;
	}
}

/**
 * This is the chunk size contants class. It contains constants that can be used in the chunk size
 * setting.
 * @class chunk
 * @id compression.constants.chunk
 */
class constants_chunk {
	/**
	* This is the MIN_CHUNK constant. It returns the minimal chunk size that can be used for the
	 compression and decompression.
	 * @summary Returns the MIN_CHUNK constant.
	* @returns {Constant} Z_MIN_CHUNK
	* @function min
	*/
	min() {
		return zlib.constants.Z_MIN_CHUNK;
	}

	/**
	 * This is the MAX_CHUNK constant. It returns the maximum chunk size that can be used for the
	 * compression and decompression.
	 * @summary Returns the MAX_CHUNK constant.
	 * @returns {Constant} Z_MAX_CHUNK
	 * @function max
	 */
	max() {
		return zlib.constants.Z_MAX_CHUNK;
	}

	/**
	 * This is the DEFAULT_CHUNK constant. It returns the default chunk size that is used for the 
	 * compression and decompression.
	 * @summary Returns the DEFAULT_CHUNK constant.
	 * @returns {Constant} Z_DEFAULT_CHUNK
	 * @function default
	 */
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
