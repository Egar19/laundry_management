import { useEffect } from 'react';

const AlertConfirm = ({
  isOpen,
  title,
  confirmText = 'Ya',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  autoClose,
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onCancel?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black/50 transition duration-300 ease-in-out">
      <div className="alert alert-soft shadow-lg w-fit max-w-96 bg-base-100 transition duration-300 ease-in">
        <span>{title}</span>
        <div className="flex gap-2 mt-2 justify-end">
          <button className="btn btn-sm btn-success" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="btn btn-sm btn-ghost" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertConfirm;