/*
 * Magic Mirror module for displaying JSON values
 * By Daniel Habenicht
 * MIT Licensed
 */

Module.register("MMM-json", {
  // Default module config.
  defaults: {
    url: "https://jsonplaceholder.typicode.com/users",
    refreshInterval: 1000 * 60 * 5 //5 minutes
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.config = {
      ...this.defaults,
      ...this.config
    };
    this.loaded = false;
    this.getData();

    var self = this;
    //Schedule updates
    setInterval(function () {
      self.getData();
      self.updateDom();
    }, this.config.refreshInterval);
  },

  //Import additional CSS Styles
  getStyles: function () {
    return ["mmm-json.css"];
  },

  //Contact node helper for data
  getData: function () {
    Log.info("MMM-json: getting data");

    this.sendSocketNotification("MMM_JSON_GET_REQUEST", {
      config: this.config
    });
  },

  //Handle node helper response
  socketNotificationReceived: function (notification, payload) {
    if (notification === "MMM_JSON_GET_RESPONSE") {
      if (payload.error === true) {
        console.error(
          "MMM-JSON: An Error occured while fetching your response. Please have a look at the server log."
        );
        this.loaded = false;
      } else {
        this.loaded = true;
        this.data = payload;
      }
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

    if (this.config.header) {
      var imgDiv = document.createElement("div");

      var sTitle = document.createElement("p");
      sTitle.innerHTML = this.config.header;
      sTitle.className += "normal";

      if (this.config.headerIcon) {
        var icon = document.createElement("i");
        icon.className = "fas " + this.config.headerIcon;
        sTitle.style = "margin: 0px 0px 0px 15px;";
        imgDiv.appendChild(icon);
      }
      imgDiv.appendChild(sTitle);

      var divider = document.createElement("hr");
      divider.className += " dimmed";
      wrapper.appendChild(imgDiv);
      wrapper.appendChild(divider);
    }

    for (var i = 0; i < this.data.length; i++) {
      var row = document.createElement("tr");

      var titleTr = document.createElement("td");
      var dataTr = document.createElement("td");

      titleTr.innerHTML = this.data[i].title + ":";
      dataTr.innerHTML =
        (this.data[i].prefix ? this.data[i].prefix : "") +
        " " +
        this.data[i].value +
        " " +
        (this.data[i].suffix ? this.data[i].suffix : "");

      titleTr.className += " small regular bright";
      dataTr.className += " small light bright";

      row.appendChild(titleTr);
      row.appendChild(dataTr);

      tb.appendChild(row);
    }
    wrapper.appendChild(tb);
    return wrapper;
  }
});
