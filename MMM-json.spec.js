/* eslint no-multi-spaces: 0 */
const expect = require("chai").expect;
var jsdom = require("mocha-jsdom");
let modulename = "MMM-json";
let identifier = "test";

describe("Functions module MMM-json", function () {
  before(function () {
    Module = {};
    Module.definitions = {};
    Module.register = function (name, moduleDefinition) {
      Module.definitions[name] = moduleDefinition;
    };
    require("./MMM-json");
    Module.definitions[modulename].updateDom = () => {
      // noop
    };
    Module.definitions[modulename].config = {};
    Module.definitions[modulename].identifier = identifier;
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

    describe("without header icon, but header", function () {
      before(function () {
        delete Module.definitions[modulename].config.headerIcon;
        Module.definitions[modulename].data = {};
        Module.definitions[modulename].data.header = "I am a Header";
      });

      it(`should contain header`, function () {
        expect(Module.definitions[modulename].getHeader()).to.equal(
          "I am a Header"
        );
      });
    });
    describe("without header icon and no header", function () {
      before(function () {
        delete Module.definitions[modulename].config.headerIcon;
        Module.definitions[modulename].data = {};
        delete Module.definitions[modulename].data.header;
      });

      it(`should contain empty header`, function () {
        expect(Module.definitions[modulename].getHeader()).to.equal("");
      });
    });
  });

  describe("dom", function () {
    jsdom({
      url: "https://localhost"
    });
    describe("config", function () {
      it(`missing - null`, function () {
        delete Module.definitions[modulename].config.url;
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          "<div>Missing configuration.</div>"
        );
      });
      it(`missing - empty`, function () {
        Module.definitions[modulename].config.url = "";
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          "<div>Missing configuration.</div>"
        );
      });
      it(`loading`, function () {
        Module.definitions[modulename].config.url = "https://localhost";
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          "<div>Loading...</div>"
        );
      });
    });
    describe("data", function () {
      before(function () {
        Module.definitions[modulename].config.url = "https://localhost";
      });
      it(`normal`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [{ title: "test-title", value: ["test-value"] }],
            error: false
          }
        );

        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">test-title:</td><td class="small light bright">test-value</td></tr></table></div>'
        );
      });
      it(`basic - prefix`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [
              { title: "test-title", value: ["test-value"], prefix: "PREFIX" }
            ],
            error: false
          }
        );
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">test-title:</td><td class="small light bright">PREFIX test-value</td></tr></table></div>'
        );
      });
      it(`basic - suffix`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [
              { title: "test-title", value: ["test-value"], suffix: "SUFFIX" }
            ],
            error: false
          }
        );
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">test-title:</td><td class="small light bright">test-value SUFFIX</td></tr></table></div>'
        );
      });

      it(`basic - both`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [
              {
                title: "test-title",
                value: ["test-value"],
                prefix: "PREFIX",
                suffix: "SUFFIX"
              }
            ],
            error: false
          }
        );
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">test-title:</td><td class="small light bright">PREFIX test-value SUFFIX</td></tr></table></div>'
        );
      });

      it(`basic - all`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [
              {
                title: "title1",
                value: ["value1"],
                prefix: "PREFIX",
                suffix: "SUFFIX"
              },
              {
                title: "title2",
                value: ["value2"],
                prefix: ["PREFIX"],
                suffix: ["SUFFIX"]
              },
              {
                title: "title3",
                value: ["value3a", "value3b"],
                prefix: ["PREFIXa", "PREFIXb"],
                suffix: ["SUFFIXa", "SUFFIXb"]
              },
              {
                title: "title4",
                value: ["value4a", "value4b"],
                prefix: "PREFIX",
                suffix: "SUFFIX"
              }
            ],
            error: false
          }
        );
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">title1:</td><td class="small light bright">PREFIX value1 SUFFIX</td></tr><tr><td class="small regular bright">title2:</td><td class="small light bright">PREFIX value2 SUFFIX</td></tr><tr><td class="small regular bright">title3:</td><td class="small light bright">PREFIXa value3a SUFFIXa</td><td class="small light bright">PREFIXb value3b SUFFIXb</td></tr><tr><td class="small regular bright">title4:</td><td class="small light bright">PREFIX value4a SUFFIX</td><td class="small light bright">PREFIX value4b SUFFIX</td></tr></table></div>'
        );
      });
    });
  });
});
