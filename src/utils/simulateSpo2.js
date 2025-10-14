const axios = require('axios');

// Function to generate random spo2 between 90% and 100%
function getRandomSpO2() { 
  return (Math.random() * (100 - 90) + 90).toFixed(1);
}


// Simulating sending spo2 data at specific times during the day (2 AM, 6 AM, 10 AM, 2 PM, 6 PM, 10 PM)
function simulateSpo2Data(babyId) {
  const times = ['02:00 AM', '06:00 AM', '10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'];

  // Loop through each time and send spo2 data
  times.forEach((time) => {
    const spo2 = getRandomSpO2();
    const timestamp = new Date().setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1].split(" ")[0]), 0, 0);
    
    // Send data to backend
    axios.post('http://localhost:5000/api/baby/save-spo2', {
      babyId,
      spo2,
      timestamp
    })
    .then(response => {
      console.log(`Spo2 for ${time} sent successfully!`);
    })
    .catch(error => {
      console.error(`Error sending spo2 for ${time}:`, error);
    });
  });
}

// Function to run spo2 simulation continuously
const startContinuousSpo2Processing = (intervalMs = 30000) => {
  console.log(`Starting continuous spo2 processing every ${intervalMs / 1000} seconds`);
  setInterval(() => {
    simulateSpo2Data(5);  // Replace with the actual babyId
  }, intervalMs);
};

// Run the processor
startContinuousSpo2Processing();
