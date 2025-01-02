Module.register("MMM-ElPrisSwe", {

  defaults: {
    testMode: false,          		    // Enable testmode or not
    region: "SE3",            		    // Regions - valid (SE1, SE2, SE3, SE4)
    showIcon: true,           		    // Shows icons
    updateInterval: (60 * 5) * 1000,	// 5 min delay
    initialLoadDelay: 100,    		    // Delay for first update
    animationSpeed: 1000,     		    // How fast it should animate in millisecond
  },

  // Required scripts
  getScripts: function() {
    return ["moment.js"];
  },

  // Define required styles
  getStyles: function() {
    return ["MMM-ElPrisSwe.css"];
  },

  // Define header for module
  getHeader: function() {
    return this.translate("Title") + " - " + this.config.region;
  },

  getTranslations: function() {
    return {
      en: "translations/en.json",
      sv: "translations/sv.json"
    }
  },

  start: function() {
    Log.info("Starting module: " + this.name);
    this.loaded = false;
    this.priceData = {};

    this.scheduleUpdate(this.config.initialLoadDelay);
  },

  // Override dom generator
  getDom: function() {
    // creating the table
		var table = document.createElement("table");
		table.className = "small";

    // The loading sequence
    if (!this.loaded) {
      var wrapper = createElement("div");
      wrapper.innerHTML = this.translate("Loading_Module");
      wrapper.classList.add("bright", "light", "small");
      return wrapper;
    }

    this.loaded = true;
    
    // Collect table data
    var priceData = this.priceData;
    var currentPrice = priceData[0]?.price != null ? Number(priceData[0].price) : 0;
    var currentHour = priceData[0]?.time != null ? priceData[0].time : "N/A";
    var previousPrice = priceData[1]?.price != null ? Number(priceData[1].price) : 0;
    var previousHour = priceData[1]?.time != null ? priceData[1].time : "N/A";
    var nextPrice = priceData[2]?.price != null ? Number(priceData[2].price) : 0;
    var nextHour = priceData[2]?.time != null ? priceData[2].time : "N/A";


    // Create row-current
    var currentPriceRow = document.createElement("tr");
    currentPriceRow.className = "currentRow";

    var currentPriceText = document.createElement("td");
    currentPriceText.className = "normal";
    currentPriceText.innerHTML = '<i class="fa-solid fa-coins"></i>' + "&nbsp;" + this.translate("Current_Price"); 
    currentPriceRow.appendChild(currentPriceText);

    var currentPriceData = document.createElement("td");
    currentPriceData.className = "normal";
    currentPriceData.innerHTML = currentPrice.toFixed(3) + "&nbsp;" + this.translate("Currency") + " (" + currentHour.slice(-2) + ":00)";
    currentPriceRow.appendChild(currentPriceData);

    table.appendChild(currentPriceRow);   // Appen row to table

    // Create row-previous
    var previousPriceRow = document.createElement("tr");
    previousPriceRow.className = "previousRow";

    var previousPriceText = document.createElement("td");
    previousPriceText.className = "normal";
    previousPriceText.innerHTML = '<i class="fa-solid fa-coins"></i>' + "&nbsp;" + this.translate("Previous_Price"); 
    previousPriceRow.appendChild(previousPriceText);

    var previousPriceData = document.createElement("td");
    previousPriceData.className = "normal";
    previousPriceData.innerHTML = previousPrice.toFixed(3) + "&nbsp;" + this.translate("Currency") + " (" + previousHour.slice(-2) + ":00)";
    previousPriceRow.appendChild(previousPriceData);
    
    table.appendChild(previousPriceRow);    // Append row to table

    // Create row-next
    var nextPriceRow = document.createElement("tr");
    nextPriceRow.className = "nextRow";

    var nextPriceText = document.createElement("td");
    nextPriceText.className = "normal";
    nextPriceText.innerHTML = '<i class="fa-solid fa-coins"></i>' + "&nbsp;" + this.translate("Next_Price"); 
    nextPriceRow.appendChild(nextPriceText);

    var nextPriceData = document.createElement("td");
    nextPriceData.className = "normal";
    nextPriceData.innerHTML = nextPrice.toFixed(3) + "&nbsp;" + this.translate("Currency") + " (" + nextHour.slice(-2) + ":00)";
    nextPriceRow.appendChild(nextPriceData);
    
    table.appendChild(nextPriceRow);    // Append row to table

    return table;
  },

  // Updating
	scheduleUpdate: function() { 
		setInterval(() => {
      this.getPrices();}, 
      this.config.updateInterval);
		this.getPrices();
		var self = this;
	},

  // When notifications comes from node_helper
	socketNotificationReceived: function(notification, payload) { 
		if (notification === "DATA_RESULTS") {

		  this.processData(payload);
		  this.updateDom(this.config.initialLoadDelay); 
		}
	},

	// process data from node_helper
	processData: function(data) { 
		this.priceData = data;
		this.loaded = true;
	},

	// asks node_helper for data
	getPrices: function() { 
		this.sendSocketNotification('GET_DATA', this.config.region);
	},

});
