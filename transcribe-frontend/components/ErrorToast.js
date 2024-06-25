import { useEffect, useState } from 'react';

const ErrorToast = ({ message, duration }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <div className="toast">{message}</div>;
};

export default ErrorToast;
