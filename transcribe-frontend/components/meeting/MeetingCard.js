import styles from '../../styles/Meeting.module.css';

const MeetingCard = ({ title, overview }) => {
  return (
    <li class={styles['cs-item']}>
      <div class={styles['cs-flex']}>
        <h3 class={styles['cs-h3']}>{title}</h3>
        <p class={styles['cs-item-text']}>{overview}</p>
        <a href="" class={styles['cs-link']}>
          Open meeting
          <img
            class={styles['cs-arrow']}
            loading="lazy"
            decoding="async"
            src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Icons/event-chevron.svg"
            alt="icon"
            width="20"
            height="20"
            aria-hidden="true"
          />
        </a>
      </div>
    </li>
  );
};

export default MeetingCard;
