import React, { useState } from 'react';
import styles from '../styles/Transcribe.module.css';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import RecordingControls from '../components/transcription/RecordingControls';
import TranscribedText from '../components/transcription/TranscribedText';

const mockAnswer =
  'Example answer to transcription here: Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit distinctio quas asperiores reiciendis! Facilis quia recusandae velfacere delect corrupti!';
const mockAnalysis =
  'Example analysis to transcription here: Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit distinctio quas asperiores reiciendis! Facilis quia recusandae velfacere delect corrupti!';

const TranscribeContainer = ({ streaming = true, timeSlice = 1000 }) => {
  const [analysis, setAnalysis] = useState('');
  const [answer, setAnswer] = useState('');
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const whisperApiEndpoint = 'https://api.openai.com/v1/audio/';
  const { recording, transcribed, handleStartRecording, handleStopRecording } =
    useAudioRecorder(streaming, timeSlice, apiKey, whisperApiEndpoint);

  const handleGetAnalysis = () => {
    setAnalysis(mockAnalysis);
  };

  const handleGetAnswer = () => {
    setAnswer(mockAnswer);
  };

  const handleStopMeeting = () => {};

  return (
    <div style={{ margin: '20px' }}>
      <button
        className={styles['end-meeting-button']}
        onClick={handleStopMeeting}
      >
        End Meeting
      </button>
      <input
        type="text"
        placeholder="Meeting title here..."
        className={styles['custom-input']}
      />
      <div>
        <RecordingControls
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
        />
        {recording ? (
          <p className={styles['primary-text']}>Recording</p>
        ) : (
          <p>Not recording</p>
        )}
        <TranscribedText
          transcribed={transcribed}
          answer={answer}
          analysis={analysis}
          handleGetAnalysis={handleGetAnalysis}
          handleGetAnswer={handleGetAnswer}
        />
      </div>
    </div>
  );
};

export default TranscribeContainer;
