const axios = require('axios');

// Function to generate random humidity value between 30% and 80%
function getRandomHumidity() {
  return (Math.random() * (80 - 30) + 30).toFixed(1);
}

// Simulating sending humidity data at specific times during the day (2 AM, 6 AM, 10 AM, 2 PM, 6 PM, 10 PM)
function simulateHumidityData(babyId) {
  const times = ['02:00 AM', '06:00 AM', '10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'];

  // Loop through each time and send humidity data
  times.forEach((time) => {
    const humidity = getRandomHumidity();
    const timestamp = new Date().setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1].split(" ")[0]), 0, 0);
    
    // Send data to backend
    axios.post('http://localhost:5000/api/baby/save-humidity', {
      babyId,
      humidity,
      timestamp
    })
    .then(response => {
      console.log(`Humidity for ${time} sent successfully!`);
    })
    .catch(error => {
      console.error(`Error sending humidity for ${time}:`, error);
    });
  });
}

// Function to run humidity simulation continuously
const startContinuousHumidityProcessing = (intervalMs = 30000) => {
  console.log(`Starting continuous humidity processing every ${intervalMs / 1000} seconds`);
  setInterval(() => {
    simulateHumidityData(5);  // Replace with the actual babyId
  }, intervalMs);
};

// Run the processor
startContinuousHumidityProcessing();
