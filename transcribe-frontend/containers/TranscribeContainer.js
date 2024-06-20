import React, { useState, useEffect } from 'react';
import styles from '../styles/Transcribe.module.css';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import RecordingControls from '../components/transcription/RecordingControls';
import TranscribedText from '../components/transcription/TranscribedText';
import { useRouter } from 'next/router';
import { useMeetings } from '../hooks/useMeetings';
import { createNewTranscription } from '../api/transcriptions';

const mockAnswer =
  'Example answer to transcription here: Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit distinctio quas asperiores reiciendis! Facilis quia recusandae velfacere delect corrupti!';
const mockAnalysis =
  'Example analysis to transcription here: Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit distinctio quas asperiores reiciendis! Facilis quia recusandae velfacere delect corrupti!';

const TranscribeContainer = ({ streaming = true, timeSlice = 1000 }) => {
  const router = useRouter();
  const [analysis, setAnalysis] = useState('');
  const [answer, setAnswer] = useState('');
  const [meetingId, setMeetingId] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const {
    getMeetingDetails,
    saveTranscriptionToMeeting,
    updateMeetingDetails,
    loading,
    error,
    meetingDetails,
  } = useMeetings();
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const whisperApiEndpoint = 'https://api.openai.com/v1/audio/';
  const { recording, transcribed, handleStartRecording, handleStopRecording } =
    useAudioRecorder(streaming, timeSlice, apiKey, whisperApiEndpoint);

  const { ended } = meetingDetails;
  const transcribedHistory = meetingDetails?.transcribed_chunks?.data;

  useEffect(() => {
    const fetchDetails = async () => {
      if (router.isReady) {
        const { meetingId } = router.query;
        if (meetingId) {
          try {
            await getMeetingDetails(meetingId);
            setMeetingId(meetingId);
          } catch (err) {
            console.log('Error getting meeting details - ', err);
          }
        }
      }
    };

    fetchDetails();
  }, [router.isReady, router.query]);

  useEffect(() => {
    setMeetingTitle(meetingDetails.title);
  }, [meetingDetails]);

  const handleGetAnalysis = () => {
    setAnalysis(mockAnalysis);
  };

  const handleGetAnswer = () => {
    setAnswer(mockAnswer);
  };

  const handleStopMeeting = async () => {
    // provide meeting overview and save it
    // getMeetingOverview(transcribed_chunks)
    await updateMeetingDetails(
      {
        title: meetingTitle,
        ended: true,
      },
      meetingId
    );

    // re-fetch meeting details
    await getMeetingDetails(meetingId);
  };

  const stopAndSaveTranscription = async () => {
    // save transcription first
    let {
      data: { id: transcriptionId },
    } = await createNewTranscription(transcribed);

    // make a call to save the transcription chunk here
    await saveTranscriptionToMeeting(meetingId, meetingTitle, transcriptionId);
    // re-fetch current meeting which should have updated transcriptions
    await getMeetingDetails(meetingId);
    // Stop and clear the current transcription as it's now saved
    await handleStopRecording();
  };

  const handleGoBack = () => {
    router.back();
  };

  console.log('meetingDetails - ', meetingDetails);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ margin: '20px' }}>
      {ended && (
        <button onClick={handleGoBack} className={styles.goBackButton}>
          Go Back
        </button>
      )}
      {!ended && (
        <button
          className={styles['end-meeting-button']}
          onClick={handleStopMeeting}
        >
          End Meeting
        </button>
      )}
      {ended ? (
        <p className={styles.title}>{meetingTitle}</p>
      ) : (
        <input
          onChange={(e) => setMeetingTitle(e.target.value)}
          value={meetingTitle}
          type="text"
          placeholder="Meeting title here..."
          className={styles['custom-input']}
        />
      )}
      <div>
        {!ended && (
          <div>
            <RecordingControls
              handleStartRecording={handleStartRecording}
              handleStopRecording={stopAndSaveTranscription}
            />
            {recording ? (
              <p className={styles['primary-text']}>Recording</p>
            ) : (
              <p>Not recording</p>
            )}
          </div>
        )}

        {/*Current transcription*/}
        {transcribed && <h1>Current transcription</h1>}
        <TranscribedText
          transcribed={transcribed}
          answer={answer}
          analysis={analysis}
          handleGetAnalysis={handleGetAnalysis}
          handleGetAnswer={handleGetAnswer}
        />

        {/*Transcribed history*/}
        <h1>History</h1>
        {transcribedHistory?.map((val, i) => {
          const transcribedChunk = val.attributes;
          return (
            <TranscribedText
              key={i}
              transcribed={transcribedChunk.text}
              answer={transcribedChunk.answer}
              analysis={transcribedChunk.analysis}
              handleGetAnalysis={handleGetAnalysis}
              handleGetAnswer={handleGetAnswer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TranscribeContainer;
