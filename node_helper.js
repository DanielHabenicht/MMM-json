var request = require("request");
var jp = require("jsonpath");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    var self = this;
    console.log("Notification: " + notification + " Payload: " + payload);

    if (notification === "MMM_JSON_GET_REQUEST") {
      request(payload.config.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var jsonData = JSON.parse(body);
          self.sendSocketNotification(
            "MMM_JSON_GET_RESPONSE",
            payload.config.values.map((val) => {
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
          );
        }
      });
    }
  }
});
