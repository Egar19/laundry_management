const Toast = ({ message , variant }) => {
  const varian = {
    success: 'alert-success',
    error: 'alert-error',
  };

  return (
    <div className='toast toast-top toast-center'>
      <div className={`alert ${varian[variant]}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
