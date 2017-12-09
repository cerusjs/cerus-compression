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
	var stream;

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

	self.open = function() {
		var options = {
			flush: flush,
			finishFlush: finish,
			chunkSize: chunk,
			windowBits: window,
			level: level,
			memLevel: memory,
			strategy: strategy
		}

		switch(type) {
			case "deflate":
				stream = zlib.createDeflate();
				break;
			case "deflate_raw":
				stream = zlib.createDeflateRaw();
				break;
			case "gunzip":
				stream = zlib.createGunzip();
				break;
			case "gzip":
				stream = zlib.createGzip();
				break;
			case "inflate":
				stream = zlib.createInflate();
				break;
			case "inflate_raw":
				stream = zlib.createInflateRaw();
				break;
			case "unzip":
				stream = zlib.createUnzip();
				break;
			default:
				throw new Error("the specified type of compression does not exist");
				break;
		}
	}

	self.events = function() {
		if(stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		return cerus.promise(function(event) {
			stream.on("drain", function() {
				event("drain");
			});

			stream.on("error", function(err) {
				event("error", err);
			});

			stream.on("finish", function() {
				event("finish");
			});

			stream.on("pipe", function() {
				event("pipe");
			});

			stream.on("unpipe", function() {
				event("unpipe");
			});
		});
	}

	self.stream = function() {
		return stream;
	}

	self.write = function(chunk, encoding) {
		if(stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		if(typeof chunk !== "string" && !(chunk instanceof Buffer)) {
			throw new TypeError("the argument chunk must be a string or buffer");
		}

		return cerus.promise(function(event) {
			stream.write(chunk, encoding, function() {
				event("flushed");
			});
		});
	}

	self.end = function(chunk, encoding) {
		if(stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		return cerus.promise(function(event) {
			stream.write(chunk, encoding, function() {
				event("flushed");
			});
		});
	}

	self.cork = function() {
		if(stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		stream.cork();
	}

	self.uncork = function() {
		if(stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		stream.uncork();
	}

	self.destroy = function(error) {
		if(stream === undefined) {
			throw new Error("there has no stream been opened yet");
		}

		stream.destroy(error);
	}

	self.compress = function(data, encoding) {
		var options = {
			flush: flush,
			finishFlush: finish,
			chunkSize: chunk,
			windowBits: window,
			level: level,
			memLevel: memory,
			strategy: strategy
		}

		encoding = encoding || "utf-8";

		if(typeof data !== "string") {
			throw new TypeError("argument data must be a string");
		}

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
					zlib.deflate(Buffer.from(data, encoding), options, func);
					break;
				case "deflate_raw":
					zlib.deflateRaw(Buffer.from(data, encoding), options, func);
					break;
				case "gunzip":
					zlib.gunzip(Buffer.from(data, encoding), options, func);
					break;
				case "gzip":
					zlib.gzip(Buffer.from(data, encoding), options, func);
					break;
				case "inflate":
					zlib.inflate(Buffer.from(data, encoding), options, func);
					break;
				case "inflate_raw":
					zlib.inflateRaw(Buffer.from(data, encoding), options, func);
					break;
				case "unzip":
					zlib.unzip(Buffer.from(data, encoding), options, func);
					break;
				default:
					event("error", "the specified type of compression does not exist");
					break;
			}

			return func;
		});
	}

	return self;
}