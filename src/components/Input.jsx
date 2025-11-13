const Input = ({ label, type, placeholder, register, value, readOnly, error }) => {
  return (
    <>
      <label className='label'>{label}</label>
      <input
        type={type}
        className='input w-full'
        placeholder={placeholder}
        {...register}
        readOnly={readOnly}
        value={value}
      />
      {error && <p className='text-error text-sm mt-1'>{error.message}</p>}
    </>
  );
};

export default Input;
