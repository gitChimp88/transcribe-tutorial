import React, { useEffect } from 'react';
import styles from '../styles/Meeting.module.css';
import MeetingCard from '../components/meeting/MeetingCard';
import { useRouter } from 'next/router';
import { useMeetings } from '../hooks/useMeetings';

const MeetingDashboardContainer = () => {
  const router = useRouter();
  const {
    meetings,
    loading,
    error,
    getMeetings,
    createMeeting,
    deleteMeetingDetails,
  } = useMeetings();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    await getMeetings();
  };

  const handleNewMeeting = async () => {
    try {
      // Call the API to create a new meeting
      const newMeeting = await createMeeting();

      // Route to transcription page and pass the newly created meeting id
      router.push(`/transcription?meetingId=${newMeeting.id}`);
    } catch (error) {
      console.error('Error creating new meeting:', error);
      alert('Failed to create a new meeting. Please try again.');
    }
  };

  const openMeeting = (meetingId) => {
    router.push(`/transcription?meetingId=${meetingId}`);
  };

  const deleteMeeting = async (meetingId) => {
    try {
      await deleteMeetingDetails(meetingId);
      // refetch meeting dashboard data
      await getMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting. Please try again.');
    }
  };

  return (
    <div id={styles['meeting-container']}>
      <div className={styles['cs-container']}>
        <div className={styles['cs-content']}>
          <div className={styles['cs-content-flex']}>
            <span className={styles['cs-topper']}>Meeting dashboard</span>
            <h2 className={styles['cs-title']}>Start a new meeting!</h2>
          </div>
          <button
            onClick={handleNewMeeting}
            className={styles['cs-button-solid']}
          >
            New meeting
          </button>
        </div>
        <ul className={styles['cs-card-group']}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading previous meetings</p>
          ) : (
            meetings.map((val, i) => {
              const { title, overview } = val.attributes;
              return (
                <MeetingCard
                  key={val.id}
                  title={title}
                  id={val.id}
                  overview={overview}
                  openMeeting={openMeeting}
                  deleteMeeting={deleteMeeting}
                />
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default MeetingDashboardContainer;
