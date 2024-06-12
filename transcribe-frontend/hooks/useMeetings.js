import { useState } from 'react';
import {
  fetchMeetings,
  fetchMeetingDetails,
  connectTranscriptionToMeeting,
  updateMeeting,
  deleteMeeting,
  createNewMeeting,
} from '../api/meetings';

export const useMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMeetings = async () => {
    try {
      const response = await fetchMeetings();
      const { data } = await response;

      setMeetings(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const createMeeting = async () => {
    try {
      const response = await createNewMeeting();
      const { data } = await response;

      return data;
    } catch (error) {
      setError(error);
    }
  };

  const getMeetingDetails = async (meetingId) => {
    setLoading(true);
    try {
      const response = await fetchMeetingDetails(meetingId);
      const { data } = await response;

      setLoading(false);
      setMeetingDetails(data.attributes);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const saveTranscriptionToMeeting = async (
    meetingId,
    meetingTitle,
    transcriptionId
  ) => {
    try {
      await connectTranscriptionToMeeting(
        meetingId,
        meetingTitle,
        transcriptionId
      );
    } catch (error) {
      setError(error);
    }
  };

  const updateMeetingDetails = async (updatedMeeting, meetingId) => {
    try {
      await updateMeeting(updatedMeeting, meetingId);
    } catch (error) {
      setError(error);
    }
  };

  const deleteMeetingDetails = async (meetingId) => {
    try {
      await deleteMeeting(meetingId);
    } catch (error) {
      setError(error);
    }
  };

  return {
    meetings,
    getMeetingDetails,
    createMeeting,
    saveTranscriptionToMeeting,
    updateMeetingDetails,
    getMeetings,
    deleteMeetingDetails,
    loading,
    error,
    meetingDetails,
  };
};
