import { useGetAllExpense } from '../hooks/expenses/useGetAllExpense';
import { useAddExpense } from '../hooks/expenses/useAddExpense';
import { useUpdateExpense } from '../hooks/expenses/useUpdateExpense';
import { useDeleteExpense } from '../hooks/expenses/useDeleteExpense';
import { useAuthUser } from '../hooks/auth/useAuthUser';
import { dateFormat } from '../utils/dateFormat';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import Input from '../components/Input';
import AlertConfirm from '../components/AlertConfirm';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const ExpensesPage = () => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedDeleteExpense, setSelectedDeleteExpense] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const { data: expenseResponse, isLoading: expenseIsLoading } =
    useGetAllExpense({ page, limit, search: searchTerm });

  const { mutate: addExpense, isPending: addExpenseIsPending } = useAddExpense();
  const { mutate: updateExpense, isPending: updateExpenseIsPending } = useUpdateExpense();
  const { mutate: deleteExpense, isPending: deleteExpenseIsPending } = useDeleteExpense();

  const { data: authUser } = useAuthUser();

  const expenses = expenseResponse?.data || [];
  const totalExpenses = expenseResponse?.count || 0;
  const totalPages = Math.ceil(totalExpenses / limit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddOpenModal = () => {
    setModalType('add');
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (expense) => {
    if (!expense) return;
    setModalType('edit');
    setSelectedExpense(expense);
    reset({
      deskripsi: expense.deskripsi,
      biaya: expense.biaya,
    });
    setIsModalOpen(true);
  };

  const handleDeleteAlert = (expense) => {
    setSelectedDeleteExpense(expense);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const onAddSubmit = async (data, e) => {
    e.preventDefault();
    try {
      await addExpense({
        ...data,
        id_pengguna: authUser.user.id,
      });
      setShowToast({
        message: 'Data pengeluaran berhasil ditambahkan',
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

  const onEditSubmit = async (expense, e) => {
    e.preventDefault();
    try {
      await updateExpense({
        id_pengeluaran: selectedExpense.id_pengeluaran,
        ...expense,
      });
      setShowToast({
        message: 'Berhasil mengubah data pengeluaran',
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

  const onDeleteExpense = async () => {
    if (!selectedDeleteExpense) return;
    try {
      await deleteExpense(selectedDeleteExpense.id_pengeluaran);
      setShowToast({
        message: 'Berhasil menghapus data pengeluaran',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({
        message: err.message,
        variant: 'error',
      });
    } finally {
      setSelectedDeleteExpense(null);
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
        isOpen={!!selectedDeleteExpense}
        title={`Yakin ingin hapus data pengeluaran "${selectedDeleteExpense?.deskripsi}"?`}
        onConfirm={onDeleteExpense}
        confirmText={deleteExpenseIsPending ? 'Menghapus...' : 'Hapus'}
        onCancel={() => setSelectedDeleteExpense(null)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        confirmText={'Simpan'}
        title={modalType === 'add' ? 'Tambah Data Pengeluaran' : 'Edit Data Pengeluaran'}
        onConfirm={handleSubmit(modalType === 'add' ? onAddSubmit : onEditSubmit)}
        disabled={addExpenseIsPending || updateExpenseIsPending}
      >
        <form
          className='flex flex-col gap-3'
          onSubmit={modalType === 'add' ? onAddSubmit : onEditSubmit}
        >
          <Input
            label='Deskripsi'
            type='text'
            placeholder='Masukkan deskripsi pengeluaran'
            register={register('deskripsi', {
              required: 'Mohon isi deskripsi pengeluaran!',
            })}
            error={errors.deskripsi}
          />
          <Input
            label='Biaya'
            type='number'
            placeholder='Masukkan jumlah biaya'
            register={register('biaya', {
              required: 'Mohon isi jumlah biaya!',
              min: { value: 0, message: 'Biaya tidak boleh negatif!' },
            })}
            error={errors.biaya}
          />
        </form>
      </Modal>

      <div className='my-4 flex justify-between items-center gap-2'>
        <button onClick={handleAddOpenModal} className='btn btn-success'>
          + Tambah Pengeluaran
        </button>
        <SearchBar
          placeholder='Cari pengeluaran...'
          onSearch={(value) => setSearchTerm(value)}
        />
      </div>

      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <thead>
            <tr>
              <th>Deskripsi</th>
              <th>Biaya</th>
              <th>Tanggal Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {expenseIsLoading && (
              <tr>
                <td colSpan={4} className='text-center opacity-30'>
                  <Loading />
                </td>
              </tr>
            )}
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className='text-center opacity-30'>
                  Tidak ada data pengeluaran
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id_pengeluaran}>
                  <td>{expense.deskripsi}</td>
                  <td>Rp {Number(expense.biaya).toLocaleString('id-ID')}</td>
                  <td>{dateFormat(expense.tanggal_dibuat)}</td>
                  <td className='flex gap-2'>
                    <button
                      onClick={() => handleEditOpenModal(expense)}
                      className='btn btn-sm btn-warning'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(expense)}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
      />
    </div>
  );
};

export default ExpensesPage;
