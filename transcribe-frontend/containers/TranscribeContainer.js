import React, { useState, useEffect } from 'react';
import styles from '../styles/Transcribe.module.css';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import RecordingControls from '../components/transcription/RecordingControls';
import TranscribedText from '../components/transcription/TranscribedText';
import ErrorToast from '../components/ErrorToast';
import { useRouter } from 'next/router';
import { useMeetings } from '../hooks/useMeetings';
import { useInsightGpt } from '../hooks/useInsightGpt';
import { createNewTranscription } from '../api/transcriptions';

const TranscribeContainer = ({ streaming = true, timeSlice = 1000 }) => {
  const router = useRouter();
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
  const {
    loadingAnalysis,
    transcriptionIdLoading,
    analysisError,
    getAndSaveTranscriptionAnalysis,
    getAndSaveOverviewAnalysis,
  } = useInsightGpt();
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const whisperApiEndpoint = 'https://api.openai.com/v1/audio/';
  const {
    recording,
    transcribed,
    handleStartRecording,
    handleStopRecording,
    setTranscribed,
  } = useAudioRecorder(streaming, timeSlice, apiKey, whisperApiEndpoint);

  const { ended, overview } = meetingDetails;
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

  const handleGetAnalysis = async (input, transcriptionId) => {
    await getAndSaveTranscriptionAnalysis('analysis', input, transcriptionId);
    // re-fetch meeting details
    await getMeetingDetails(meetingId);
  };

  const handleGetAnswer = async (input, transcriptionId) => {
    await getAndSaveTranscriptionAnalysis('answer', input, transcriptionId);
    // re-fetch meeting details
    await getMeetingDetails(meetingId);
  };

  const handleStopMeeting = async () => {
    // provide meeting overview and save it
    const transcribedHistoryText = transcribedHistory
      .map((val) => `transcribed_chunk: ${val.attributes.text}`)
      .join(', ');

    await getAndSaveOverviewAnalysis(
      'analysis',
      transcribedHistoryText,
      meetingId
    );

    await updateMeetingDetails(
      {
        title: meetingTitle,
        ended: true,
      },
      meetingId
    );

    // re-fetch meeting details
    await getMeetingDetails(meetingId);
    setTranscribed('');
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
      {error || analysisError ? (
        <ErrorToast message={error || analysisError} duration={5000} />
      ) : null}
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
        {loadingAnalysis && <p>Loading Overview...</p>}
        {overview && (
          <div>
            <h1>Overview</h1>
            <p>{overview}</p>
          </div>
        )}
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
        <TranscribedText transcribed={transcribed} current={true} />

        {/*Transcribed history*/}
        <h1>History</h1>
        {transcribedHistory
          ?.slice()
          .reverse()
          .map((val, i) => {
            const transcribedChunk = val.attributes;
            const text = transcribedChunk.text;
            const transcriptionId = val.id;
            return (
              <TranscribedText
                key={transcriptionId}
                transcribed={text}
                answer={transcribedChunk.answer}
                analysis={transcribedChunk.analysis}
                handleGetAnalysis={() =>
                  handleGetAnalysis(text, transcriptionId)
                }
                handleGetAnswer={() => handleGetAnswer(text, transcriptionId)}
                loading={transcriptionIdLoading === transcriptionId}
              />
            );
          })}
      </div>
    </div>
  );
};

export default TranscribeContainer;
