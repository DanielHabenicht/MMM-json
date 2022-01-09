/* eslint no-multi-spaces: 0 */
const expect = require("chai").expect;

let modulename = "MMM-json";

xdescribe("Functions module MMM-json", function () {
  before(function () {
    Module = {};
    config = {};
    Module.definitions = {};
    Module.register = function (name, moduleDefinition) {
      Module.definitions[name] = moduleDefinition;
    };
    require("./MMM-json");
    Module.definitions[modulename].config = {};
  });

  describe("getHeader", function () {
    describe("with header icon", function () {
      before(function () {
        Module.definitions[modulename].config.headerIcon = "icon";
      });

      it(`should be empty`, function () {
        expect(Module.definitions[modulename].getHeader()).to.equal("");
      });
    });

    describe("without header icon", function () {
      before(function () {
        Module.definitions[modulename].data.header = "I am a Header";
      });

      it(`should contain header`, function () {
        expect(Module.definitions[modulename].getHeader()).to.equal(
          "I am a Header"
        );
      });
    });
  });
});
