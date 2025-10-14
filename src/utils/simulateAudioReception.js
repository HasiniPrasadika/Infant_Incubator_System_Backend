const fs = require('fs');
const path = require('path');
const axios = require('axios');
const moment = require('moment-timezone');

const api = axios.create({
  timeout: 120000, 
  maxRetries: 3,
  retryDelay: 2000
});

api.interceptors.response.use(undefined, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    config.retry = api.defaults.maxRetries;
  }

  if (config.retry === 0) {
    return Promise.reject(error);
  }

  config.retry -= 1;
  config.timeout = api.defaults.timeout;

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    console.log(`Request timed out, retrying... (${config.retry} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, api.defaults.retryDelay));
    return api(config);
  }

  return Promise.reject(error);
});

// Path to your simulated or real audio files
const AUDIO_FILES_PATH = path.join(__dirname, '../../audio');

// Ensure audio directory exists
const ensureAudioDirectory = () => {
  if (!fs.existsSync(AUDIO_FILES_PATH)) {
    fs.mkdirSync(AUDIO_FILES_PATH, { recursive: true });
    console.log(`Created audio directory at: ${AUDIO_FILES_PATH}`);
  }
  console.log(`Looking for audio files in: ${AUDIO_FILES_PATH}`);
};

const simulateAudioReception = async () => {
  try {
    ensureAudioDirectory();
    
    const audioFiles = fs.readdirSync(AUDIO_FILES_PATH).filter(file => 
      file.endsWith('.wav') || file.endsWith('.mp3')
    );

    if (audioFiles.length === 0) {
      console.log('No audio files found. Waiting for files...');
      return;
    }

    const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    const filePath = path.join(AUDIO_FILES_PATH, randomFile);
    
    // Create timestamp in Sri Lankan timezone (UTC+5:30)
    const sriLankaTime = moment().tz('Asia/Colombo');
    const timestamp = sriLankaTime.format();

    console.log(`Processing audio file: ${filePath} at ${sriLankaTime.format('YYYY-MM-DD HH:mm:ss')} (Sri Lanka Time)`);

    try {
      console.log('Sending classification request...');
      const classificationResponse = await api.post('http://localhost:5000/api/classify', {
        filePath,
        timestamp,
      });

      if (classificationResponse.data.success) {
        console.log('Classification successful:', classificationResponse.data);

        const cryStatus = classificationResponse.data.cryStatus.toUpperCase();

        const updateResponse = await api.put(
          `http://localhost:5000/api/baby/${classificationResponse.data.babyId}`,
          {
            cryStatus,
            cryTimeUpdate: timestamp
          }
        );

        console.log('Database updated with time:', timestamp);
      }
    } catch (axiosError) {
      console.error('API call failed:', 
        axiosError.response?.data || axiosError.message
      );
    }

  } catch (error) {
    console.error('Error in audio processing:', error.message);
  }
};


// Increase interval to allow for longer processing time
const startContinuousProcessing = (intervalMs = 60000) => {
  console.log(`Starting continuous audio processing every ${intervalMs/1000} seconds`);
  simulateAudioReception(); // Run first time
  setInterval(simulateAudioReception, intervalMs);
};

// Run the processor
startContinuousProcessing();