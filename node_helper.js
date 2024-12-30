const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  socketNotificationReceived: function(notification, data) {
    if (notification === "GET_DATA") {
	    // console.log(data)
      this.getPriceData(data);
    }
  },

  getPriceData: async function(region) {
    const today = new Date();
    const todayList = [
      today.getFullYear().toString(), // year
      (today.getMonth() + 1).toString(), // month
      today.getDate().toString()// day
      ];

    const url = `https://www.elprisetjustnu.se/api/v1/prices/${todayList[0]}/${todayList[1]}-${todayList[2]}_${region}.json`;
    // console.log(url) //debug
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const data = await response.json();

      // Hämta aktuell tid
      const now = new Date();

      const formatHour = date => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      return `${year}-${month}-${day}T${hour}`;
      };

      // Hämta aktuell timme
      const currentHour = formatHour(now);

      // Hämta föregående timme
      const previousHourDate = new Date(now);
      previousHourDate.setHours(now.getHours() - 1);
      const previousHour = formatHour(previousHourDate);

      // Hämta nästa timme
      const nextHourDate = new Date(now);
      nextHourDate.setHours(now.getHours() + 1);
      const nextHour = formatHour(nextHourDate);


      // Filtrera ut raden för de aktuella timmarna
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
        //console.log(prices);

        this.sendSocketNotification("DATA_RESULTS", prices);

    } else {
        console.log("No data found for this specific time");
        this.sendSocketNotification("SEND_DATA", { prices: [] });
    }

    } catch (error) {
      console.error("An error occured:", error);
    }
  },
});
