/* eslint no-multi-spaces: 0 */
const expect = require("chai").expect;
var jsdom = require("mocha-jsdom");
let modulename = "MMM-json";
let identifier = "test";

describe("Functions module MMM-json", function () {
  before(function () {
    Module = {};
    config = {};
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
        Module.definitions[modulename].config = {
          url: "https://localhost"
        };
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          "<div>Loading...</div>"
        );
      });
    });
    describe("data", function () {
      before(function () {
        Module.definitions[modulename].config = {
          url: "https://localhost"
        };
      });
      it(`normal`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [{ title: "test-title", value: "test-value" }],
            error: false
          }
        );

        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">test-title:</td><td class="small light bright">test-value</td></tr></table></div>'
        );
      });
      it(`advanced - prefix`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [
              { title: "test-title", value: "test-value", prefix: "PREFIX" }
            ],
            error: false
          }
        );
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">test-title:</td><td class="small light bright">PREFIX test-value</td></tr></table></div>'
        );
      });
      it(`advanced - suffix`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [
              { title: "test-title", value: "test-value", suffix: "SUFFIX" }
            ],
            error: false
          }
        );
        expect(Module.definitions[modulename].getDom().outerHTML).to.equal(
          '<div><table><tr><td class="small regular bright">test-title:</td><td class="small light bright">test-value SUFFIX</td></tr></table></div>'
        );
      });

      it(`advanced - both`, function () {
        Module.definitions[modulename].socketNotificationReceived(
          "MMM_JSON_RESPONSE",
          {
            identifier: identifier,
            data: [
              {
                title: "test-title",
                value: "test-value",
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
    });
  });
});
