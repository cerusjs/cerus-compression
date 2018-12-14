/**
 * This is the constants class. It contains multiple classes with constants for the compression 
 * settings that are available in the settings class.
 * @class compression.constants
 */
module.exports = class constants {

	/**
	 * This function returns the {@link compression.constants.flush.constructor} class. It contains the constants for the flush 
	 * setting.
	 * @summary Returns the {@link compression.constants.flush.constructor} class.
	 * @return {Class} The {@link compression.constants.flush.constructor} class.
	 * @function flush
	 */
	flush() {
		if(this.flush === undefined) {
			this.flush = new constants_flush();
		}

		return this.flush;
	}

	/**
	 * This functions return the {@link compression.constants.codes.constructor} class. It contains codes, like errors, the 
	 * compression class may return.
	 * @summary Returns the {@link compression.constants.codes.constructor} class.
	 * @return {Class} The {@link compression.constants.codes.constructor} class.
	 * @function codes
	 */
	codes() {
		if(this.codes === undefined) {
			this.codes = new constants_codes();
		}

		return this.codes;
	}

	/**
	 * This functions return the {@link compression.constants.level.constructor} class. It contains the constants for the 
	 * compression level setting.
	 * @summary Returns the {@link compression.constants.level.constructor} class.
	 * @return {Class} The {@link compression.constants.level.constructor} class.
	 * @function level
	 */
	level() {
		if(this.level === undefined) {
			this.level = new constants_level();
		}

		return this.level;
	}

	/**
	 * This functions return the {@link compression.constants.strategy.constructor} class. It contains the constants for the 
	 * compression strategy setting.
	 * @summary Returns the {@link compression.constants.strategy.constructor} class.
	 * @return {Class} The {@link compression.constants.strategy.constructor} class.
	 * @function strategy
	 */
	strategy() {
		if(this.strategy === undefined) {
			this.strategy = new constants_strategy();
		}

		return this.strategy;
	}

	/**
	 * This functions return the {@link compression.constants.windowbits.constructor} class. It contains the constants for the 
	 * windowbits setting.
	 * @summary Returns the {@link compression.constants.windowbits.constructor} class.
	 * @return {Class} The {@link compression.constants.windowbits.constructor} class.
	 * @function windowbits
	 */
	windowbits() {
		if(this.windowbits === undefined) {
			this.windowbits = new constants_windowbits();
		}

		return this.windowbits;
	}

	/**
	 * This functions return the {@link compression.constants.memory.constructor} class. It contains the constants for the memory
	 * level setting.
	 * @summary Returns the {@link compression.constants.memory.constructor} class.
	 * @return {Class} The {@link compression.constants.memory.constructor} class.
	 * @function memory
	 */
	memory() {
		if(this.memory === undefined) {
			this.memory = new constants_memory();
		}

		return this.memory;
	}

	/**
	 * This functions return the {@link compression.constants.chunk.constructor} class. It contains the constants for the chunk size
	 * setting.
	 * @summary Returns the {@link compression.constants.chunk.constructor} class.
	 * @return {Class} The {@link compression.constants.chunk.constructor} class.
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
 * @class compression.constants.flush
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
 * @class compression.constants.codes
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
 * @class compression.constants.level
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
 * @class compression.constants.strategy
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
 * @class compression.constants.windowbits
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
 * @class compression.constants.memory
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
 * @class compression.constants.chunk
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