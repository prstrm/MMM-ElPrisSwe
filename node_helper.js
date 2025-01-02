const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  // If notification is received then run this funtion with the incoming param: data.
  socketNotificationReceived: function(notification, data) {
    if (notification === "GET_DATA") {
	    // Log.info(data)   // Debug data recieved
      this.getPriceData(data);
    }
  },

  getPriceData: async function(region) {
    const today = new Date();
    const todayList = [
      today.getFullYear().toString(),                     // Get year as str
      (today.getMonth() + 1).toString().padStart(2, "0"), // Get month as str with double digit (01, 02, etc...)
      today.getDate().toString().padStart(2, "0")	        // Get day as str with double digit (01, 02, etc...)
      ];
    // Log.info(todayList);	  // Debug list

    const url = `https://www.elprisetjustnu.se/api/v1/prices/${todayList[0]}/${todayList[1]}-${todayList[2]}_${region}.json`;
    // Log.info(url)          // Debug url
    
    // Trying to fetch data with param: url
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const data = await response.json();

      // Get date and time
      const now = new Date();

      const formatHour = date => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      return `${year}-${month}-${day}T${hour}`;
      };

      // Current hour
      const currentHour = formatHour(now);

      // Previous hour
      const previousHourDate = new Date(now);
      previousHourDate.setHours(now.getHours() - 1);
      const previousHour = formatHour(previousHourDate);

      // Next hour
      const nextHourDate = new Date(now);
      nextHourDate.setHours(now.getHours() + 1);
      const nextHour = formatHour(nextHourDate);

      // Filter out hours
      const currentPriceData = data.find(item => item.time_start.startsWith(currentHour));
      const previousPriceData = data.find(item => item.time_start.startsWith(previousHour));
      const nextPriceData = data.find(item => item.time_start.startsWith(nextHour));

      if (currentPriceData) {

        // Extrahera och formatera relevanta fält
        const currentPrice = currentPriceData.SEK_per_kWh.toString();
        const previousPrice = previousPriceData.SEK_per_kWh.toString();
        const nextPrice = nextPriceData.SEK_per_kWh.toString();

        const prices = [
            {price: currentPrice, time: currentHour},
            {price: previousPrice, time: previousHour},
            {price: nextPrice, time: nextHour},
        ];

        Log.info(`${this.name}: Fetching new prices from ${this.config.region}!`)
        this.sendSocketNotification("DATA_RESULTS", prices);

    } else {
        Log.info("No data found for this specific time");
        this.sendSocketNotification("SEND_DATA", { prices: [] });
    }

    } catch (error) {
      Log.info("An error occured:", error);
    }
  },
});
