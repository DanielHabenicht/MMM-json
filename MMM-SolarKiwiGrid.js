/*
 * Magic Mirror module for displaying Enphase Solar data
 * By Thomas Krywitsky
 * MIT Licensed
 */

Module.register("MMM-SolarKiwiGrid", {
  // Default module config.
  defaults: {
    url: "https://api.enphaseenergy.com/api/v2/systems/",
    apiKey: "", //Enter API key
    userId: "4d7a45774e6a41320a", //Sample user ID
    systemId: "67", //Sample system
    refInterval: 1000 * 60 * 5, //5 minutes
    basicHeader: false
  },

  start: function () {
    Log.info("Starting module: " + this.name);

    this.titles = ["Ladezustand:"];
    this.suffixes = ["%"];
    this.results = ["Loading"];
    this.loaded = false;
    this.getSolarData();

    if (this.config.basicHeader) {
      this.data.header = "Solar PV";
    }

    var self = this;
    //Schedule updates
    setInterval(function () {
      self.getSolarData();
      self.updateDom();
    }, this.config.refInterval);
  },

  //Import additional CSS Styles
  getStyles: function () {
    return ["solar.css"];
  },

  //Contact node helper for solar data
  getSolarData: function () {
    Log.info("SolarApp: getting data");

    this.sendSocketNotification("GET_SOLAR", {
      config: this.config
    });
  },

  //Handle node helper response
  socketNotificationReceived: function (notification, payload) {
    if (notification === "SOLAR_DATA") {
      this.results[0] = payload.result.items.find(
        (e) => e.guid === "urn:solarwatt:myreserve:bc:a30b000a5526"
      ).tagValues.StateOfCharge.value;
      this.loaded = true;
      this.updateDom(1000);
    }
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");
    if (this.config.url === "") {
      wrapper.innerHTML = "Missing configuration.";
      return wrapper;
    }

    //Display loading while waiting for API response
    if (!this.loaded) {
      wrapper.innerHTML = "Loading...";
      return wrapper;
    }

    var tb = document.createElement("table");

    if (!this.config.basicHeader) {
      var imgDiv = document.createElement("div");
      var icon = document.createElement("i");
      icon.className = "fas fa-sun";

      var sTitle = document.createElement("p");
      sTitle.innerHTML = "Solar";
      sTitle.className += " thin";
      imgDiv.appendChild(icon);
      imgDiv.appendChild(sTitle);

      var divider = document.createElement("hr");
      divider.className += " dimmed";
      wrapper.appendChild(imgDiv);
      wrapper.appendChild(divider);
    }

    for (var i = 0; i < this.results.length; i++) {
      var row = document.createElement("tr");

      var titleTr = document.createElement("td");
      var dataTr = document.createElement("td");

      titleTr.innerHTML = this.titles[i];
      dataTr.innerHTML = this.results[i] + " " + this.suffixes[i];

      titleTr.className += " medium regular bright";
      dataTr.classname += " medium light normal";

      row.appendChild(titleTr);
      row.appendChild(dataTr);

      tb.appendChild(row);
    }
    wrapper.appendChild(tb);
    return wrapper;
  }
});
