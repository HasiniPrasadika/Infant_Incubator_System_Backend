const axios = require('axios');

// Function to generate random temperature between 36.5°C and 38.5°C
function getRandomTemperature() {
  return (Math.random() * (38.5 - 36.5) + 36.5).toFixed(1);
}

// Simulating sending temperature data at specific times during the day (2 AM, 6 AM, 10 AM, 2 PM, 6 PM, 10 PM)
function simulateTemperatureData(babyId) {
  const times = ['02:00 AM', '06:00 AM', '10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'];

  // Loop through each time and send temperature data
  times.forEach((time) => {
    const temperature = getRandomTemperature();
    const timestamp = new Date().setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1].split(" ")[0]), 0, 0);
    
    // Send data to backend
    axios.post('http://localhost:5000/api/baby/save-temp', {
      babyId,
      temperature,
      timestamp
    })
    .then(response => {
      console.log(`Temperature for ${time} sent successfully!`);
    })
    .catch(error => {
      console.error(`Error sending temperature for ${time}:`, error);
    });
  });
}

// Function to run temperature simulation continuously
const startContinuousTemperatureProcessing = (intervalMs = 30000) => {
  console.log(`Starting continuous temperature processing every ${intervalMs / 1000} seconds`);
  setInterval(() => {
    simulateTemperatureData(5);  // Replace with the actual babyId
  }, intervalMs);
};

// Run the processor
startContinuousTemperatureProcessing();
