const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
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

    if (notification === "MMM_JSON_REQUEST") {
      fetch(payload.config.url, payload.config.fetchOptions)
        .then(async (response) => {
          //Success
          console.debug(response);
          if (Math.floor(response.status / 100) === 2) {
            var responseObject;

            jsonData = await do_jq(payload.config.jq, await response.json());
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

            self.sendSocketNotification("MMM_JSON_RESPONSE", responseObject);
          }
        })
        .catch((error) => {
          console.error(error);
          // Error
          self.sendSocketNotification("MMM_JSON_RESPONSE", {
            identifier: payload.identifier,
            error: true
          });
          console.error(self.name + " error:", error);
        });
    }
  }
});
