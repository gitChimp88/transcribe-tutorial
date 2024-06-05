import styles from '../../styles/Transcribe.module.css';

function RecordingControls({ handleStartRecording, handleStopRecording }) {
  return (
    <div className={styles['control-container']}>
      <button
        className={styles['primary-button']}
        onClick={handleStartRecording}
      >
        Start Recording
      </button>
      <button
        className={styles['secondary-button']}
        onClick={handleStopRecording}
      >
        Stop Recording
      </button>
    </div>
  );
}

export default RecordingControls;
