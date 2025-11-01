import { useState } from 'react';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { useGetAllUsers } from '../hooks/users/useGetAllUsers';
import { useToggleDeactivateUser } from '../hooks/users/useToggleDeactivateUser';
import AlertConfirm from '../components/AlertConfirm';
import Modal from '../components/Modal';
import { useUpdateUser } from '../hooks/users/useUpdateUser';
import { useAddUser } from '../hooks/users/useAddUser';
import { useForm } from 'react-hook-form';
import Input from '../components/Input';

const UsersPage = () => {
  const {
    data: users,
    error: usersError,
    isLoading: usersIsLoading,
  } = useGetAllUsers();

  const {
    mutate: addUser,
    isPending: addUserIsPending,
    error: addUserError,
  } = useAddUser();
  const {
    mutate: updateUser,
    isPending: updateUserPending,
    error: updateUserError,
  } = useUpdateUser();
  const { mutate: toggleUser, isPending: toggleIsPending } =
    useToggleDeactivateUser();

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedToggleUser, setSelectedToggleUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddOpenModal = () => {
    setModalType('add');
    setSelectedUser(null);
    reset({
      nama: '',
      email: '',
      peran: '',
    });
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (user) => {
    if (!user) return;
    setModalType('edit');
    setSelectedUser(user);
    reset({
      nama: user.nama,
      email: user.email,
      peran: user.peran,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => setIsModalOpen(false);

  const handleToggle = (user) => {
    setSelectedToggleUser(user);
  };

  const confirmToggle = () => {
    if (!selectedToggleUser) return;
    toggleUser(selectedToggleUser.id_pengguna);
    setSelectedToggleUser(null);
  };

  const onAddSubmit = async (data) => {
    await addUser(data);
    setIsModalOpen(false);
  };

  const onEditSubmit = async (data) => {
    await updateUser({
      id_pengguna: selectedUser.id_pengguna,
      nama: data.nama,
      peran: data.peran,
    });
    setIsModalOpen(false);
    console.log('edited:', selectedUser.id_pengguna, data);
  };

  const isSubmitting = addUserIsPending || updateUserPending;

  return (
    <div className='overflow-x-auto'>
      {usersError && (
        <Toast message={usersError.message} variant='error' duration={5000} />
      )}
      {addUserError && (
        <Toast message={addUserError.message} variant='error' duration={5000} />
      )}
      {updateUserError && (
        <Toast
          message={updateUserError.message}
          variant='error'
          duration={5000}
        />
      )}

      {usersIsLoading && <Loading />}
      
      <AlertConfirm
        isOpen={!!selectedToggleUser}
        title={`Apakah Anda yakin ingin ${
          selectedToggleUser?.aktif ? 'menonaktifkan' : 'mengaktifkan'
        } pengguna ${selectedToggleUser?.nama}?`}
        confirmText={selectedToggleUser?.aktif ? 'Nonaktifkan' : 'Aktifkan'}
        onConfirm={confirmToggle}
        onCancel={() => setSelectedToggleUser(null)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        confirmText={isSubmitting ? 'Menyimpan...' : 'Simpan'}
        onConfirm={handleSubmit(
          modalType === 'add' ? onAddSubmit : onEditSubmit
        )}
        title={modalType === 'add' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
        disabled={isSubmitting}
      >
        <form className='flex flex-col gap-3'>
          <Input
            label='Nama'
            type='text'
            placeholder='Masukkan nama pengguna'
            register={register('nama', { required: 'Nama wajib diisi' })}
            error={errors.nama}
          />

          {modalType === 'add' && (
            <Input
              label='Email'
              type='email'
              placeholder='Masukkan email pengguna'
              register={register('email', {
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Format email tidak valid',
                },
              })}
              error={errors.email}
            />
          )}

          {modalType === 'add' && (
            <Input
              label='Password'
              type='password'
              placeholder='Masukkan password'
              register={register('password', {
                required: 'Password wajib diisi',
                minLength: {
                  value: 6,
                  message: 'Password minimal 6 karakter',
                },
              })}
              error={errors.password}
            />
          )}

          <div>
            <label className='label'>Peran</label>
            <select
              className='select w-full'
              {...register('peran', { required: 'Peran wajib dipilih' })}
            >
              <option value='pegawai'>Pegawai</option>
              <option value='admin'>Admin</option>
            </select>
            {errors.peran && (
              <p className='text-error text-sm mt-1'>{errors.peran.message}</p>
            )}
          </div>
        </form>
      </Modal>

      <div className='my-4'>
        <button onClick={handleAddOpenModal} className='btn btn-success'>
          + Tambah Pengguna Baru
        </button>
      </div>

      <table className='table w-full'>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Peran</th>
            <th>Status Akun</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id_pengguna}>
              <td>{user.nama}</td>
              <td>{user.email}</td>
              <td>{user.peran}</td>
              <td>
                <span
                  className={`badge ${
                    user.aktif ? 'text-success' : 'text-error'
                  }`}
                >
                  {user.aktif ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              <td className='flex gap-2'>
                <button
                  onClick={() => handleEditOpenModal(user)}
                  className='btn btn-sm btn-warning'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggle(user)}
                  className={`btn btn-sm ${
                    user.aktif ? 'btn-error' : 'btn-success'
                  }`}
                  disabled={toggleIsPending}
                >
                  {user.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
