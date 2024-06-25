import { useState } from 'react';
import { callInsightGpt } from '../api/analysis';
import { updateMeeting } from '../api/meetings';
import { updateTranscription } from '../api/transcriptions';

export const useInsightGpt = () => {
  const [loadingAnalysis, setLoading] = useState(false);
  const [transcriptionIdLoading, setTranscriptionIdLoading] = useState('');
  const [analysisError, setError] = useState(null);

  const getAndSaveTranscriptionAnalysis = async (
    operation,
    input,
    transcriptionId
  ) => {
    try {
      setTranscriptionIdLoading(transcriptionId);
      // Get insight analysis / answer
      const { data } = await callInsightGpt(operation, input);
      // Use transcriptionId to save it to the transcription
      const updateTranscriptionDetails =
        operation === 'analysis'
          ? { analysis: data.message }
          : { answer: data.message };
      await updateTranscription(updateTranscriptionDetails, transcriptionId);
      setTranscriptionIdLoading('');
    } catch (e) {
      setTranscriptionIdLoading('');
      setError('Error getting analysis', e);
    }
  };

  const getAndSaveOverviewAnalysis = async (operation, input, meetingId) => {
    try {
      setLoading(true);
      // Get overview insight
      const {
        data: { message },
      } = await callInsightGpt(operation, input);
      // Use meetingId to save it to the meeting
      const updateMeetingDetails = { overview: message };
      await updateMeeting(updateMeetingDetails, meetingId);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError('Error getting overview', e);
    }
  };

  return {
    loadingAnalysis,
    transcriptionIdLoading,
    analysisError,
    getAndSaveTranscriptionAnalysis,
    getAndSaveOverviewAnalysis,
  };
};
