import { useState, useRef, useEffect } from 'react';
import { transcriptionService } from '../utils/transcriptionService';

export const useAudioRecorder = (
  streaming,
  timeSlice,
  apiKey,
  whisperApiEndpoint
) => {
  const chunks = useRef([]);
  const encoder = useRef();
  const recorder = useRef();
  const stream = useRef();
  const [recording, setRecording] = useState(false);
  const [transcribed, setTranscribed] = useState('');

  useEffect(() => {
    return () => {
      if (chunks.current) {
        chunks.current = [];
      }
      if (encoder.current) {
        encoder.current.flush();
        encoder.current = undefined;
      }
      if (recorder.current) {
        recorder.current.destroy();
        recorder.current = undefined;
      }

      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop());
        stream.current = undefined;
      }
    };
  }, []);

  const onStartStreaming = async () => {
    try {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop());
      }
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onStopStreaming = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
      stream.current = undefined;
    }
  };

  const handleStartRecording = async () => {
    try {
      setTranscribed('');

      if (!stream.current) {
        await onStartStreaming();
      }
      if (stream.current) {
        if (!recorder.current) {
          const {
            default: { RecordRTCPromisesHandler, StereoAudioRecorder },
          } = await import('recordrtc');
          const recorderConfig = {
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1,
            recorderType: StereoAudioRecorder,
            sampleRate: 44100,
            timeSlice: streaming ? timeSlice : undefined,
            type: 'audio',
            ondataavailable: streaming ? onDataAvailable : undefined,
          };
          recorder.current = new RecordRTCPromisesHandler(
            stream.current,
            recorderConfig
          );
        }
        if (!encoder.current) {
          const { Mp3Encoder } = await import('@breezystack/lamejs');
          encoder.current = new Mp3Encoder(1, 44100, 96);
        }
        const recordState = await recorder.current.getState();
        if (recordState === 'inactive' || recordState === 'stopped') {
          await recorder.current.startRecording();
        }

        setRecording(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopRecording = async () => {
    try {
      setTranscribed('');
      if (recorder.current) {
        const recordState = await recorder.current.getState();
        if (recordState === 'recording' || recordState === 'paused') {
          await recorder.current.stopRecording();
        }

        onStopStreaming();
        setRecording(false);

        await recorder.current.destroy();
        chunks.current = [];
        if (encoder.current) {
          encoder.current.flush();
          encoder.current = undefined;
        }
        recorder.current = undefined;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDataAvailable = async (data) => {
    try {
      if (streaming && recorder.current) {
        if (encoder.current) {
          const buffer = await data.arrayBuffer();
          const mp3chunk = encoder.current.encodeBuffer(new Int16Array(buffer));
          const mp3blob = new Blob([mp3chunk], { type: 'audio/mpeg' });
          chunks.current.push(mp3blob);
        }
        const recorderState = await recorder.current.getState();
        if (recorderState === 'recording') {
          const blob = new Blob(chunks.current, { type: 'audio/mpeg' });
          const file = new File([blob], 'speech.mp3', { type: 'audio/mpeg' });
          const text = await transcriptionService(
            file,
            apiKey,
            whisperApiEndpoint,
            'transcriptions'
          );
          setTranscribed(text);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    recording,
    transcribed,
    handleStartRecording,
    handleStopRecording,
  };
};
