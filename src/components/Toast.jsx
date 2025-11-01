import { useState, useEffect } from 'react';

const Toast = ({ message, variant = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  const varian = {
    success: 'alert-success',
    error: 'alert-error',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className='toast toast-top toast-center'>
      <div className={`alert ${varian[variant]}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
