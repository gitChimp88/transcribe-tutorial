import React from 'react';
import styles from '../styles/Home.module.css';
import TranscribeContainer from '../containers/TranscribeContainer';
import { useRouter } from 'next/router';

const Transcription = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <button onClick={handleGoBack} className={styles.goBackButton}>
            Go Back
          </button>
        </div>
        <h1 className={styles.title}>Transcription tool</h1>
        <TranscribeContainer />
      </main>
    </div>
  );
};

export default Transcription;
