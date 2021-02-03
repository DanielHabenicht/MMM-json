var request = require("request");
var jp = require("jsonpath");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    var self = this;
    console.log("Notification: " + notification + " Payload:", payload);

    if (notification === "MMM_JSON_GET_REQUEST") {
      request({url: payload.config.url, json: true}, function (error, response, jsonData) {
        if (!error && response.statusCode == 200) {
          var responseObject = {
            test: "test"
          };

          if (
            payload.config.values == undefined ||
            payload.config.values.length == 0
          ) {
            // Values are not defined fetch first properties
            var firstObject = jsonData;
            if (Array.isArray(jsonData)) {
              firstObject = jsonData[0];
            }
            responseObject = Object.keys(firstObject).map((prop) => {
              return {
                title: prop,
                value: firstObject[prop]
              };
            });
          } else {
            // Values are defined, get what the user wants
            responseObject = payload.config.values.map((val) => {
              return {
                ...val,
                value:
                  val.numberDevisor != undefined
                    ? (
                        jp.query(jsonData, val.query)[0] / val.numberDevisor
                      ).toFixed(3)
                    : jp.query(jsonData, val.query)[0]
              };
            });
          }

          self.sendSocketNotification("MMM_JSON_GET_RESPONSE", responseObject);
        } else {
          self.sendSocketNotification("MMM_JSON_GET_RESPONSE", {
            error: true
          });
          console.error(error);
        }
      });
    }
  }
});
