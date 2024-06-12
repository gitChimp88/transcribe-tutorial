import React from 'react';
import styles from '../styles/Home.module.css';
import TranscribeContainer from '../containers/TranscribeContainer';

const Transcription = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <TranscribeContainer />
      </main>
    </div>
  );
};

export default Transcription;
