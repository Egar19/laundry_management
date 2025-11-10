import { useGetAllPackages } from '../hooks/packages/useGetAllPackages';
import { useAddPackage } from '../hooks/packages/useAddPackage';
import { useUpdatePackage } from '../hooks/packages/useUpdatePackage';
import { useDeletePackage } from '../hooks/packages/useDeletePackage';
import { useAuthUser } from '../hooks/auth/useAuthUser';
import { dateFormat } from '../utils/dateFormat';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import Input from '../components/Input';
import AlertConfirm from '../components/AlertConfirm';

const PackageSettingsPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDeletePackage, setSelectedDeletePackage] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');

  const { data: packageResponse, isLoading: packageIsLoading } = useGetAllPackages();
  const { mutate: addPackage, isPending: addPackageIsPending } = useAddPackage();
  const { mutate: updatePackage, isPending: updatePackageIsPending } = useUpdatePackage();
  const { mutate: deletePackage, isPending: deletePackageIsPending } = useDeletePackage();

  const { data: authUser } = useAuthUser();

  const packages = packageResponse || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddOpenModal = () => {
    setModalType('add');
    setSelectedPackage(null);
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (pkg) => {
    if (!pkg) return;
    setModalType('edit');
    setSelectedPackage(pkg);
    reset({
      nama_paket: pkg.nama_paket,
      estimasi: pkg.estimasi,
      harga_per_kg: pkg.harga_per_kg,
    });
    setIsModalOpen(true);
  };

  const handleDeleteAlert = (pkg) => {
    setSelectedDeletePackage(pkg);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const onAddSubmit = async (data, e) => {
    e.preventDefault();
    try {
      await addPackage({
        ...data,
        id_pengguna: authUser.user.id,
      });
      setShowToast({
        message: 'Data paket berhasil ditambahkan',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({
        message: err.message,
        variant: 'error',
      });
    } finally {
      setIsModalOpen(false);
      reset();
    }
  };

  const onEditSubmit = async (pkg, e) => {
    e.preventDefault();
    try {
      await updatePackage({
        id_jenis_paket: selectedPackage.id_jenis_paket,
        ...pkg,
      });
      setShowToast({
        message: 'Berhasil mengubah data paket',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({
        message: err.message,
        variant: 'error',
      });
    } finally {
      setIsModalOpen(false);
      reset();
    }
  };

  const onDeletePackage = async () => {
    if (!selectedDeletePackage) return;
    try {
      await deletePackage(selectedDeletePackage.id_jenis_paket);
      setShowToast({
        message: 'Berhasil menghapus data paket',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({
        message: err.message,
        variant: 'error',
      });
    } finally {
      setSelectedDeletePackage(null);
    }
  };

  return (
    <div className='p-4'>
      {showToast && (
        <Toast
          message={showToast.message}
          variant={showToast.variant}
          duration={5000}
          onClose={() => setShowToast(null)}
        />
      )}

      <AlertConfirm
        isOpen={!!selectedDeletePackage}
        title={`Yakin ingin hapus paket "${selectedDeletePackage?.nama_paket}"?`}
        onConfirm={onDeletePackage}
        confirmText={deletePackageIsPending ? 'Menghapus...' : 'Hapus'}
        onCancel={() => setSelectedDeletePackage(null)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        confirmText={'Simpan'}
        title={modalType === 'add' ? 'Tambah Jenis Paket' : 'Edit Jenis Paket'}
        onConfirm={handleSubmit(modalType === 'add' ? onAddSubmit : onEditSubmit)}
        disabled={addPackageIsPending || updatePackageIsPending}
      >
        <form
          className='flex flex-col gap-3'
          onSubmit={modalType === 'add' ? onAddSubmit : onEditSubmit}
        >
          <Input
            label='Nama Paket'
            type='text'
            placeholder='Masukkan nama paket'
            register={register('nama_paket', {
              required: 'Mohon isi nama paket!',
            })}
            error={errors.nama_paket}
          />
          <Input
            label='Estimasi'
            type='text'
            placeholder='Masukkan estimasi waktu (contoh: 2 Hari, 12 Jam)'
            register={register('estimasi', {
              required: 'Mohon isi estimasi!',
            })}
            error={errors.estimasi}
          />
          <Input
            label='Harga per Kg'
            type='number'
            placeholder='Masukkan harga per kilogram'
            register={register('harga_per_kg', {
              required: 'Mohon isi harga per Kg!',
              min: { value: 0, message: 'Harga tidak boleh negatif!' },
            })}
            error={errors.harga_per_kg}
          />
        </form>
      </Modal>

      <div className='my-4 flex justify-between items-center gap-2'>
        <button onClick={handleAddOpenModal} className='btn btn-success'>
          + Tambah Jenis Paket
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <thead>
            <tr>
              <th>Nama Paket</th>
              <th>Estimasi</th>
              <th>Harga per Kg</th>
              <th>Tanggal Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {packageIsLoading && (
              <tr>
                <td colSpan={5} className='text-center opacity-30'>
                  <Loading />
                </td>
              </tr>
            )}
            {packages.length === 0 ? (
              <tr>
                <td colSpan={5} className='text-center opacity-30'>
                  Tidak ada jenis paket
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id_jenis_paket}>
                  <td>{pkg.nama_paket}</td>
                  <td>{pkg.estimasi}</td>
                  <td>Rp {Number(pkg.harga_per_kg).toLocaleString('id-ID')}</td>
                  <td>{dateFormat(pkg.tanggal_dibuat)}</td>
                  <td className='flex gap-2'>
                    <button
                      onClick={() => handleEditOpenModal(pkg)}
                      className='btn btn-sm btn-warning'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(pkg)}
                      className='btn btn-sm btn-error'
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageSettingsPage;
