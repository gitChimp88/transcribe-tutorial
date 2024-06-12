import styles from '../../styles/Meeting.module.css';

const MeetingCard = ({ title, id, overview, openMeeting, deleteMeeting }) => {
  return (
    <li className={styles['cs-item']}>
      <div className={styles['cs-flex']}>
        <div style={{ display: 'flex', width: '100%' }}>
          <h3 className={styles['cs-h3']}>{title}</h3>
          <div
            onClick={() => deleteMeeting(id)}
            style={{
              marginLeft: 'auto',
              cursor: 'pointer',
              padding: '5px',
            }}
          >
            X
          </div>
        </div>
        <p className={styles['cs-item-text']}>{overview}</p>
        <p onClick={() => openMeeting(id)} className={styles['cs-link']}>
          Open meeting
          <img
            className={styles['cs-arrow']}
            loading="lazy"
            decoding="async"
            src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Icons/event-chevron.svg"
            alt="icon"
            width="20"
            height="20"
            aria-hidden="true"
          />
        </p>
      </div>
    </li>
  );
};

export default MeetingCard;
