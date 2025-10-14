import sys
import joblib
import librosa
import numpy as np
import os
import logging
import pandas as pd

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Update paths to be relative to the script location
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'models')

logger.info(f"Script directory: {script_dir}")
logger.info(f"Model path: {model_path}")

try:
    # Load your trained model and encoders
    model = joblib.load(os.path.join(model_path, 'baby_cry_model.pkl'))
    label_encoder = joblib.load(os.path.join(model_path, 'label_encoder.pkl'))
    feature_columns = joblib.load(os.path.join(model_path, 'feature_columns.pkl'))
    scaler = joblib.load(os.path.join(model_path, 'scaler.pkl'))
    logger.info("Successfully loaded all models")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    sys.exit(1)

def enhanced_features_extractor(audio_data, sample_rate):
    """Extract enhanced features from audio - same as training"""
    try:
        # If audio is too short, pad it
        if len(audio_data) < sample_rate:
            audio_data = np.pad(audio_data, (0, sample_rate - len(audio_data)), mode='constant')
        
        # If audio is too long, take first 3 seconds
        if len(audio_data) > sample_rate * 5:
            audio_data = audio_data[:sample_rate * 3]
        
        features = []
        
        # 1. MFCC features
        mfccs = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=13)
        mfccs_mean = np.mean(mfccs, axis=1)
        mfccs_std = np.std(mfccs, axis=1)
        features.extend(mfccs_mean)
        features.extend(mfccs_std)
        
        # 2. Spectral features
        spectral_centroids = librosa.feature.spectral_centroid(y=audio_data, sr=sample_rate)[0]
        features.append(np.mean(spectral_centroids))
        features.append(np.std(spectral_centroids))
        
        spectral_rolloff = librosa.feature.spectral_rolloff(y=audio_data, sr=sample_rate)[0]
        features.append(np.mean(spectral_rolloff))
        features.append(np.std(spectral_rolloff))
        
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=audio_data, sr=sample_rate)[0]
        features.append(np.mean(spectral_bandwidth))
        features.append(np.std(spectral_bandwidth))
        
        # 3. Zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(audio_data)[0]
        features.append(np.mean(zcr))
        features.append(np.std(zcr))
        
        # 4. Root Mean Square Energy
        rms = librosa.feature.rms(y=audio_data)[0]
        features.append(np.mean(rms))
        features.append(np.std(rms))
        
        # 5. Chroma features
        chroma = librosa.feature.chroma_stft(y=audio_data, sr=sample_rate)
        features.extend(np.mean(chroma, axis=1))
        
        # 6. Mel-scale spectrogram
        mel_spectrogram = librosa.feature.melspectrogram(y=audio_data, sr=sample_rate)
        mel_features = np.mean(mel_spectrogram, axis=1)
        features.extend(mel_features[:10])  # Take first 10 mel features
        
        return np.array(features)
            
    except Exception as e:
        logger.error(f"Error extracting features: {e}")
        raise

def classify_audio(file_path):
    """Classify the audio file"""
    try:
        logger.info(f"Starting classification for file: {file_path}")
        
        # Load audio file
        logger.info("Loading audio file...")
        audio_data, sample_rate = librosa.load(file_path, sr=22050)
        logger.info(f"Audio loaded with sample rate: {sample_rate}")
        
        # Extract features
        logger.info("Extracting features...")
        features = enhanced_features_extractor(audio_data, sample_rate)
        
        # Create DataFrame with proper column names
        features_df = pd.DataFrame([features], columns=feature_columns)
        
        # Scale features
        logger.info("Scaling features...")
        features_scaled = scaler.transform(features_df)
        
        # Predict
        logger.info("Making prediction...")
        prediction = model.predict(features_scaled)[0]
        predicted_class = label_encoder.inverse_transform([prediction])[0]
        
        logger.info(f"Classification result: {predicted_class}")
        return predicted_class
        
    except Exception as e:
        logger.error(f"Error in classification pipeline: {str(e)}")
        return "error_processing"

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            logger.error("No file path provided")
            print("error_no_file")
            sys.exit(1)
            
        file_path = sys.argv[1]
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            print("error_file_not_found")
            sys.exit(1)
            
        result = classify_audio(file_path)
        print(result)
        
    except Exception as e:
        logger.error(f"Main execution error: {str(e)}")
        print("error_execution")
        sys.exit(1)