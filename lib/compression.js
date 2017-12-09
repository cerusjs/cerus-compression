module.exports = function(cerus, type) {
	var self = {};
	var zlib = require("zlib");

	var flush = zlib.Z_NO_FLUSH;
	var finish = zlib.Z_FINISH;
	var chunk = zlib.Z_DEFAULT_CHUNK;
	var level = zlib.Z_DEFAULT_COMPRESSION;
	var memory = zlib.Z_DEFAULT_MEMLEVEL;
	var strategy = zlib.Z_DEFAULT_STRATEGY;
	var window = zlib.Z_DEFAULT_WINDOWBITS;
	var type = "deflate";

	self.settings = function() {
		var self_ = {};

		self_.flush = function(flush_) {
			if(flush_ != null) {
				flush = flush_;
			}

			return flush;
		}

		self_.finish = function(finish_) {
			if(finish_ != null) {
				finish = finish_;
			}

			return finish;
		}

		self_.chunk = function(chunk_) {
			if(chunk_ != null) {
				chunk = chunk_;
			}

			return chunk;
		}

		self_.level = function(level_) {
			if(level_ != null) {
				level = level_;
			}

			return level;
		}

		self_.memory = function(memory_) {
			if(memory_ != null) {
				memory = memory_;
			}

			return memory;
		}

		self_.strategy = function(strategy_) {
			if(strategy_ != null) {
				strategy = strategy_;
			}

			return strategy;
		}

		self_.window = function(window_) {
			if(window_ != null) {
				window = window_;
			}

			return window;
		}

		self_.type = function(type_) {
			if(type_ != null) {
				type = type_;
			}

			return type;
		}

		return self_;
	}

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