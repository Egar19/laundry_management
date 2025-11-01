const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm = 'Ya',
  confirmText,
  disabled,
}) => {
  return (
    <>
      <input
        type='checkbox'
        className='modal-toggle'
        checked={isOpen}
        onChange={() => {}}
      />
      <div className='modal' role='dialog'>
        <div className='modal-box'>
          {title && <h3 className='font-bold text-lg mb-2'>{title}</h3>}

          <div className='py-2'>{children}</div>

          <div className='modal-action'>
            {onConfirm && (
              <button disabled={disabled} className='btn btn-success' onClick={onConfirm}>
                {confirmText}
              </button>
            )}
            <button disabled={disabled} className='btn' onClick={onClose}>
              Batal
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
