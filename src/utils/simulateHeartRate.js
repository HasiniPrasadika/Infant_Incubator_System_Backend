const axios = require('axios');

// Function to generate random heart rate value between 60 bpm and 100 bpm
function getRandomHeartRate() {
  return (Math.random() * (100 - 60) + 60).toFixed(0);
}

// Simulating sending heart rate data at specific times during the day (2 AM, 6 AM, 10 AM, 2 PM, 6 PM, 10 PM)
function simulateHeartRateData(babyId) {
  const times = ['02:00 AM', '06:00 AM', '10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'];

  // Loop through each time and send heart rate data
  times.forEach((time) => {
    const heartRate = getRandomHeartRate();
    const timestamp = new Date().setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1].split(" ")[0]), 0, 0);
    
    // Send data to backend
    axios.post('http://localhost:5000/api/baby/save-heart-rate', {
      babyId,
      heartRate,
      timestamp
    })
    .then(response => {
      console.log(`Heart Rate for ${time} sent successfully!`);
    })
    .catch(error => {
      console.error(`Error sending heart rate for ${time}:`, error);
    });
  });
}

// Function to run heart rate simulation continuously
const startContinuousHeartRateProcessing = (intervalMs = 30000) => {
  console.log(`Starting continuous heart rate processing every ${intervalMs / 1000} seconds`);
  setInterval(() => {
    simulateHeartRateData(5);  // Replace with the actual babyId
  }, intervalMs);
};

// Run the processor
startContinuousHeartRateProcessing();
