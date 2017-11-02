/**
 * @module compression
 */
module.exports = function(cerus, type) {
	var self = {};
	var zlib = require("zlib");

	var flush = cerus.settings().compression().flush();
	var finish = cerus.settings().compression().finish();
	var chunk = cerus.settings().compression().chunk();
	var level = cerus.settings().compression().level();
	var memory = cerus.settings().compression().memory();
	var strategy = cerus.settings().compression().strategy();
	var window = cerus.settings().compression().window();
	var type = "deflate";

	/**
	 * @module compression/settings
	 */
	self.settings = function() {
		var self_ = {};

		/**
		 * @function flush
		 */
		self_.flush = function(flush_) {
			if(flush_ != null) {
				flush = flush_;
			}

			return flush;
		}

		/**
		 * @function finish
		 */
		self_.finish = function(finish_) {
			if(finish_ != null) {
				finish = finish_;
			}

			return finish;
		}

		/**
		 * @function chunk
		 */
		self_.chunk = function(chunk_) {
			if(chunk_ != null) {
				chunk = chunk_;
			}

			return chunk;
		}

		/**
		 * @function level
		 */
		self_.level = function(level_) {
			if(level_ != null) {
				level = level_;
			}

			return level;
		}

		/**
		 * @function memory
		 */
		self_.memory = function(memory_) {
			if(memory_ != null) {
				memory = memory_;
			}

			return memory;
		}

		/**
		 * @function strategy
		 */
		self_.strategy = function(strategy_) {
			if(strategy_ != null) {
				strategy = strategy_;
			}

			return strategy;
		}

		/**
		 * @function window
		 */
		self_.window = function(window_) {
			if(window_ != null) {
				window = window_;
			}

			return window;
		}

		/**
		 * @function type
		 */
		self_.type = function(type_) {
			if(type_ != null) {
				type = type_;
			}

			return type;
		}

		return self_;
	}

	/**
	 * @function compress
	 */
	self.compress = function(data) {
		var options = {
			flush: flush,
			finishFlush: finish,
			chunkSize: chunk,
			windowBits: window,
			level: level,
			memLevel: memory,
			strategy: strategy
		}

		if(data == null) {
			switch(type) {
				case "deflate":
					return zlib.createDeflate(options);
				case "deflate_raw":
					return zlib.createDeflateRaw(options);
				case "gunzip":
					return zlib.createGunzip(options);
				case "gzip":
					return zlib.createGzip(options);
				case "inflate":
					return zlib.createInflate(options);
				case "inflate_raw":
					return zlib.createInflateRaw(options);
				case "unzip":
					return zlib.createUnzip(options);
			}
		}
		else {
			return cerus.promise(function(event) {
				var func = function(err, res) {
					if(err) {
						event("error");
						return;
					}

					event(data, res);
				}

				switch(type) {
					case "deflate":
						zlib.deflate(Buffer.from(data), options, func);
						break;
					case "deflate_raw":
						zlib.deflateRaw(Buffer.from(data), options, func);
						break;
					case "gunzip":
						zlib.gunzip(Buffer.from(data), options, func);
						break;
					case "gzip":
						zlib.gzip(Buffer.from(data), options, func);
						break;
					case "inflate":
						zlib.inflate(Buffer.from(data), options, func);
						break;
					case "inflate_raw":
						zlib.inflateRaw(Buffer.from(data), options, func);
						break;
					case "unzip":
						zlib.unzip(Buffer.from(data), options, func);
						break;
				}

				return func;
			});
		}
	}

	return self;
}