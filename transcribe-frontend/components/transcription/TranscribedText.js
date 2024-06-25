import styles from '../../styles/Transcribe.module.css';

function TranscribedText({
  transcribed,
  answer,
  analysis,
  handleGetAnalysis,
  handleGetAnswer,
  loading,
  current,
}) {
  return (
    <div className={styles['transcribed-text-container']}>
      <div className={styles['speech-bubble-container']}>
        {transcribed && (
          <div className={styles['speech-bubble']}>
            <div className={styles['speech-pointer']}></div>
            <div className={styles['speech-text-question']}>{transcribed}</div>
            {!current && (
              <div className={styles['button-container']}>
                <button
                  className={styles['primary-button-analysis']}
                  onClick={handleGetAnalysis}
                >
                  Get analysis
                </button>
                <button
                  className={styles['primary-button-answer']}
                  onClick={handleGetAnswer}
                >
                  Get answer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <div className={styles['speech-bubble-container']}>
          {loading && (
            <div className={styles['analysis-bubble']}>
              <div className={styles['analysis-pointer']}></div>
              <div className={styles['speech-text-answer']}>Loading...</div>
            </div>
          )}
          {analysis && (
            <div className={styles['analysis-bubble']}>
              <div className={styles['analysis-pointer']}></div>
              <p style={{ margin: 0 }}>Analysis</p>
              <div className={styles['speech-text-answer']}>{analysis}</div>
            </div>
          )}
        </div>
        <div className={styles['speech-bubble-container']}>
          {answer && (
            <div className={styles['speech-bubble-right']}>
              <div className={styles['speech-pointer-right']}></div>
              <p style={{ margin: 0 }}>Answer</p>
              <div className={styles['speech-text-answer']}>{answer}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TranscribedText;
