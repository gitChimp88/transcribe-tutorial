import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const TranscribeContainer = ({ streaming = true, timeSlice = 1000 }) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const whisperApiEndpoint = 'https://api.openai.com/v1/audio/';
  const { recording, transcribed, handleStartRecording, handleStopRecording } =
    useAudioRecorder(streaming, timeSlice, apiKey, whisperApiEndpoint);

  return (
    <div style={{ margin: '20px' }}>
      <div>
        <button onClick={handleStartRecording}>Start recording</button>
        <button onClick={handleStopRecording}>Stop recording</button>
        {recording ? <p>Recording</p> : <p>Not recording</p>}
        <p>Transcribed Text: {transcribed}</p>
      </div>
    </div>
  );
};

export default TranscribeContainer;
