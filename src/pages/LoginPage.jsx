import { useForm } from 'react-hook-form';
import FieldInput from '../components/FieldInput';
import { useLogin } from '../hooks/auth/useLogin';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: login, isPending, isError, error } = useLogin();

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className='flex justify-center h-screen items-center'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldInput
          fieldLabel='Login'
          btnText={isPending ? <Loading /> : 'Masuk'}
          register={register}
          errors={errors}
          btnLoading={isPending}
          inputs={[
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Masukkan email',
              validation: {
                required: 'Email wajib diisi',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Format email tidak valid',
                },
              },
            },
            {
              name: 'password',
              label: 'Kata Sandi',
              type: 'password',
              placeholder: 'Masukkan kata sandi',
              validation: {
                required: 'Kata sandi wajib diisi',
                minLength: {
                  value: 6,
                  message: 'Kata sandi minimal 6 karakter',
                },
              },
            },
          ]}
        />
        {isError && (
          <Toast message={error.message} variant='error' />
        )}
      </form>
    </div>
  );
};

export default LoginPage;
