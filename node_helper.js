var request = require("request");
var jp = require("jsonpath");
const { jq } = require("jq.node");
var NodeHelper = require("node_helper");

function asPromise(context, callbackFunction, ...args) {
  return new Promise((resolve, reject) => {
    args.push((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
    if (context) {
      callbackFunction.call(context, ...args);
    } else {
      callbackFunction(...args);
    }
  });
}

async function do_jq(filter, data) {
  if (filter) {
    try {
      data = await asPromise(null, jq, JSON.stringify(data), filter, {});
      data = JSON.parse(data);
    } catch (e) {
      console.error("Error handling jq.node filter '" + filter + "':", e);
    }
  }
  return data;
}

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    var self = this;
    console.log("Notification: " + notification + " Payload:", payload);

    if (notification === "MMM_JSON_GET_REQUEST") {
      req_params = {
        url: payload.config.url,
        json: true,
        ...payload.config.request
      };
      console.debug(self.name + " req_params:", req_params);
      request(req_params, async function (error, response, jsonData) {
        if (!error && Math.floor(response.statusCode / 100) === 2) {
          var responseObject;

          jsonData = await do_jq(payload.config.jq, jsonData);
          if (
            payload.config.values == undefined ||
            payload.config.values.length == 0
          ) {
            // Values are not defined return whole object properties
            responseObject = {
              identifier: payload.identifier,
              data: Object.keys(jsonData).map((prop) => {
                return { title: prop, value: jsonData[prop] };
              })
            };
          } else {
            // Values are defined, get what the user wants
            responseObject = {
              identifier: payload.identifier,
              data: payload.config.values.map((val) => {
                return {
                  ...val,
                  value:
                    val.numberDevisor != undefined
                      ? (
                          jp.query(jsonData, val.query)[0] / val.numberDevisor
                        ).toFixed(3)
                      : jp.query(jsonData, val.query)[0]
                };
              })
            };
          }

          self.sendSocketNotification("MMM_JSON_GET_RESPONSE", responseObject);
        } else {
          self.sendSocketNotification("MMM_JSON_GET_RESPONSE", {
            identifier: payload.identifier,
            error: true
          });
          console.error(
            self.name + " error:",
            error,
            "statusCode:",
            response && response.statusCode,
            "statusMessage:",
            response && response.statusMessage
          );
        }
      });
    }
  }
});
