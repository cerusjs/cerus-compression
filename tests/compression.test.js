const expect = require("chai").expect;
const cerus = require("cerus")();
const compression_ = require("../lib/compression.js");

const compression = (type) => {
	return new compression_(cerus, type); 
}

describe("compression", () => {
	describe("#compress", () => {
		context("with the data 'test 123 test'", () => {
			it("should compress the data", done => {
				compression().compress("test 123 test")
				.then(data => {
					console.log(data.toString());
					done();
				})
				.catch(err => console.error(err));
			});
		});
	});
});