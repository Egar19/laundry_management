import Input from './Input';

const FieldInput = ({ fieldLabel, inputs = [], btnText, register, errors, btnLoading }) => {
  return (
    <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-sm mx-8 p-4'>
      <legend className='fieldset-legend text-2xl'>{fieldLabel}</legend>

      {inputs.map((input, index) => (
        <Input
          key={index}
          label={input.label}
          type={input.type}
          placeholder={input.placeholder}
          register={register(input.name, input.validation)}
          error={errors[input.name]}
        />
      ))}

      <button className='btn btn-neutral mt-4' disabled={btnLoading}>{btnText}</button>
    </fieldset>
  );
};

export default FieldInput;
