import React from 'react';
import styles from '../styles/Meeting.module.css';
import MeetingCard from '../components/meeting/MeetingCard';
import Link from 'next/link';

const meeting = [
  {
    overview:
      'Overview of the meeting here Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit distinctio quas asperiores reiciendis! Facilis quia recusandae velfacere delect corrupti!',
    title: 'Example title 1',
  },
  {
    overview:
      'Overview of the meeting here Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit distinctio quas asperiores reiciendis! Facilis quia recusandae velfacere delect corrupti!',
    title: 'Example title 2',
  },
  {
    overview:
      'Overview of the meeting here Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit distinctio quas asperiores reiciendis! Facilis quia recusandae velfacere delect corrupti!',
    title: 'Example title 3',
  },
];

const MeetingDashboardContainer = () => {
  return (
    <div id={styles['meeting-container']}>
      <div class={styles['cs-container']}>
        <div class={styles['cs-content']}>
          <div class={styles['cs-content-flex']}>
            <span class={styles['cs-topper']}>Meeting dashboard</span>
            <h2 class={styles['cs-title']}>Start a new meeting!</h2>
          </div>
          <Link href="/transcription" class={styles['cs-button-solid']}>
            New meeting
          </Link>
        </div>
        <ul class={styles['cs-card-group']}>
          {meeting.map((val, i) => {
            return (
              <MeetingCard key={i} title={val.title} overview={val.overview} />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MeetingDashboardContainer;
