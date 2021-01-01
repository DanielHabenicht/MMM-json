var request = require("request");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    var self = this;
    console.log("Notification: " + notification + " Payload: " + payload);

    if (notification === "GET_SOLAR") {
      request(payload.config.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var jsonData = JSON.parse(body);
          self.sendSocketNotification("SOLAR_DATA", jsonData);
        }
      });
    }
  }
});
