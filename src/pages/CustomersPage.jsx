import { useGetAllCustomer } from '../hooks/customers/useGetAllCustomer';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { formatTanggal } from '../utils/formatTanggal';
import { useAddCustomer } from '../hooks/customers/useAddCustomer';
import { useAuthUser } from '../hooks/auth/useAuthUser';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useUpdateCustomer } from '../hooks/customers/useUpdateCustomer';
import { useDeleteCustomer } from '../hooks/customers/useDeleteCustomer';
import AlertConfirm from '../components/AlertConfirm';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const CustomersPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDeleteCustomer, setSelectedDeleteCustomer] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: customerResponse, isLoading: customerIsLoading } =
    useGetAllCustomer(page, limit);

  const customers = customerResponse?.data || [];
  const totalCustomers = customerResponse?.count || 0;
  const totalPages = Math.ceil(totalCustomers / limit);

  const { mutate: addCustomer, isPending: addCustomerIsPending } =
    useAddCustomer();

  const { mutate: updateCustomer, isPending: updateCustomerIsPending } =
    useUpdateCustomer();

  const { mutate: deleteCustomer, isPending: deleteCustomerIsPending } =
    useDeleteCustomer();

  const { data: authUser } = useAuthUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddOpenModal = () => {
    setModalType('add');
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (customer) => {
    if (!customer) return;
    setModalType('edit');
    setSelectedCustomer(customer);
    reset({
      nama_pelanggan: customer.nama_pelanggan,
      alamat: customer.alamat,
      no_telp: customer.no_telp,
    });
    setIsModalOpen(true);
  };

  const handleDeleteAlert = (customer) => {
    setSelectedDeleteCustomer(customer);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const onAddSubmit = async (data, e) => {
    e.preventDefault();
    try {
      await addCustomer({
        ...data,
        id_pengguna: authUser.user.id,
      });
      setShowToast({
        message: 'Data pengguna berhasil ditambahkan',
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

  const onEditSubmit = async (customer, e) => {
    e.preventDefault();
    try {
      await updateCustomer({
        id_pelanggan: selectedCustomer.id_pelanggan,
        ...customer,
      });
      setShowToast({
        message: 'Berhasil mengubah data pelanggan',
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

  const onDeleteCustomer = async () => {
    if (!selectedDeleteCustomer) return;
    try {
      await deleteCustomer(selectedDeleteCustomer.id_pelanggan);
      setShowToast({
        message: 'Berhasil menghapus data customer',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({
        message: err.message,
        variant: 'error',
      });
    } finally {
      setSelectedDeleteCustomer(null);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.nama_pelanggan.toLowerCase().includes(term) ||
      customer.no_telp.toLowerCase().includes(term) ||
      customer.alamat.toLowerCase().includes(term)
    );
  });

  return (
    <div className='overflow-x-auto p-4'>
      {customerIsLoading && <Loading />}

      {showToast && (
        <Toast
          message={showToast.message}
          variant={showToast.variant}
          duration={5000}
          onClose={() => setShowToast(null)}
        />
      )}

      <AlertConfirm
        isOpen={!!selectedDeleteCustomer}
        title={`Yakin ingin hapus pelanggan atas nama ${selectedDeleteCustomer?.nama_pelanggan}?`}
        onConfirm={onDeleteCustomer}
        confirmText={deleteCustomerIsPending ? 'Menghapus...' : 'Hapus'}
        onCancel={() => setSelectedDeleteCustomer(null)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        confirmText={'Simpan'}
        title={
          modalType === 'add' ? 'Tambah Data Pelanggan' : 'Edit Data Pelanggan'
        }
        onConfirm={handleSubmit(
          modalType === 'add' ? onAddSubmit : onEditSubmit
        )}
        disabled={addCustomerIsPending || updateCustomerIsPending}
      >
        <form
          className='flex flex-col gap-3'
          onSubmit={modalType === 'add' ? onAddSubmit : onEditSubmit}
        >
          <Input
            label='Nama'
            type='text'
            placeholder='Masukkan nama pelanggan'
            register={register('nama_pelanggan', {
              required: 'Mohon isi nama pelanggan!',
            })}
            error={errors.nama_pelanggan}
          />
          <Input
            label='Alamat'
            type='text'
            placeholder='Masukkan alamat pelanggan'
            register={register('alamat', {
              required: 'Mohon isi alamat pelanggan!',
            })}
            error={errors.alamat}
          />
          <Input
            label='Telepon/WA'
            type='tel'
            placeholder='Masukkan nomor telepon/WA pelanggan'
            register={register('no_telp', {
              required: 'Mohon isi telepon/WA pelanggan!',
            })}
            error={errors.no_telp}
          />
        </form>
      </Modal>

      <div className='my-4 flex justify-between items-center'>
        <button onClick={handleAddOpenModal} className='btn btn-success'>
          + Tambah Data Pelanggan
        </button>
        <SearchBar
          placeholder='Cari pelanggan...'
          onSearch={(value) => setSearchTerm(value)}
        />
      </div>

      <table className='table w-full'>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Telepon/WA</th>
            <th>Tanggal Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan={5} className='text-center opacity-30'>
                Tidak ada pelanggan
              </td>
            </tr>
          ) : (
            filteredCustomers.map((customer) => (
              <tr key={customer.id_pelanggan}>
                <td>{customer.nama_pelanggan}</td>
                <td>{customer.alamat}</td>
                <td>{customer.no_telp}</td>
                <td>{formatTanggal(customer.tanggal_dibuat)}</td>
                <td className='flex gap-2'>
                  <button
                    onClick={() => handleEditOpenModal(customer)}
                    className='btn btn-sm btn-warning'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(customer)}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
      />
    </div>
  );
};

export default CustomersPage;
