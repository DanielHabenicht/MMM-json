/*
 * Magic Mirror module for displaying JSON values
 * By Daniel Habenicht
 * MIT Licensed
 */

Module.register("MMM-json", {
  // Default module config.
  defaults: {
    url: "https://jsonplaceholder.typicode.com/users",
    refreshInterval: 1000 * 60 * 5, // 5 minutes
    styleRules: []
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.loaded = false;
    this.getData();

    var self = this;
    // Schedule updates
    setInterval(function () {
      self.getData();
      self.updateDom();
    }, this.config.refreshInterval);
  },

  // Import additional CSS Styles
  getStyles: function () {
    return ["mmm-json.css"];
  },

  // Contact node helper for data
  getData: function () {
    Log.info("MMM-json: getting data");

    this.sendSocketNotification("MMM_JSON_REQUEST", {
      config: this.config,
      identifier: this.identifier
    });
  },

  // Handle node helper response
  socketNotificationReceived: function (notification, payload) {
    if (
      notification === "MMM_JSON_RESPONSE" &&
      payload.identifier === this.identifier
    ) {
      if (payload.error === true) {
        console.error(
          "MMM-JSON: An Error occured while fetching your response. Please have a look at the server log."
        );
        this.loaded = false;
      } else {
        this.loaded = true;
        this.response = payload.data;
      }
      this.updateDom(1000);
    }
  },
  // Override the Header generator
  getHeader: function () {
    // If an Icon should be displayed we need our own header
    if (this.config.headerIcon) {
      return "";
    } else {
      return this.data.header || "";
    }
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");
    if (this.config.url == null || this.config.url === "") {
      wrapper.innerHTML = "Missing configuration.";
      return wrapper;
    }

    // Display loading while waiting for API response
    if (!this.loaded) {
      wrapper.innerHTML = "Loading...";
      return wrapper;
    }

    var tb = document.createElement("table");

    // Display our own header if we want an icon
    if (this.config.headerIcon) {
      var imgDiv = document.createElement("div");

      var sTitle = document.createElement("p");
      sTitle.innerHTML = this.data.header || "";
      sTitle.className += "normal";

      var icon = document.createElement("i");
      icon.className = "fas " + this.config.headerIcon;
      sTitle.style = "margin: 0px 0px 0px 15px;";
      imgDiv.appendChild(icon);
      imgDiv.appendChild(sTitle);

      var divider = document.createElement("hr");
      divider.className += "dimmed";
      wrapper.appendChild(imgDiv);
      wrapper.appendChild(divider);
    }

    for (var i = 0; i < this.response.length; i++) {
      var row = document.createElement("tr");

      if (this.response[i].icon) {
        var icon = document.createElement("i");
        icon.style = "vertical-align: middle;";
        icon.className = this.response[i].icon;
        row.appendChild(icon);
      }

      var titleTr = document.createElement("td");
      if (this.response[i].title) {
        titleTr.className = "small regular bright";
        titleTr.innerHTML =
          (this.response[i].title ? this.response[i].title : "") + ":";
      }
      row.appendChild(titleTr);

      for (var j = 0; j < this.response[i].value.length; j++) {
        var dataTr = document.createElement("td");

        // Add Prefix
        if (
          this.response[i].prefix != null &&
          (!Array.isArray(this.response[i].prefix) ||
            this.response[i].prefix[j])
        ) {
          dataTr.innerHTML += Array.isArray(this.response[i].prefix)
            ? this.response[i].prefix[j]
            : this.response[i].prefix;
          dataTr.innerHTML += " ";
        }

        // Add Value
        dataTr.innerHTML += this.response[i].value[j];

        // Add Suffix
        if (
          this.response[i].suffix != null &&
          (!Array.isArray(this.response[i].suffix) ||
            this.response[i].suffix[j])
        ) {
          dataTr.innerHTML += " ";
          dataTr.innerHTML += Array.isArray(this.response[i].suffix)
            ? this.response[i].suffix[j]
            : this.response[i].suffix;
        }

        // Add Matching Styles
        if (
          this.config.styleRules != null &&
          this.config.styleRules.length > 0
        ) {
          for (var k = 0; k < this.config.styleRules.length; k++) {
            if (this.config.styleRules[k].match(this.response[i].value[j])) {
              if (this.config.styleRules[k].style != null) {
                dataTr.style = this.config.styleRules[k].style;
              }
              if (this.config.styleRules[k].class != null) {
                dataTr.className += " " + this.config.styleRules[k].class;
              }
            }
          }
        }
        dataTr.className = "small light bright";
        row.appendChild(dataTr);
      }

      tb.appendChild(row);
    }
    wrapper.appendChild(tb);
    return wrapper;
  }
});
