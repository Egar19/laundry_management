import { useGetAllTransactions } from '../hooks/transactions/useGetAllTransactions';
import { useAddTransaction } from '../hooks/transactions/useAddTransaction';
import { useUpdateTransaction } from '../hooks/transactions/useUpdateTransaction';
import { useDeleteTransaction } from '../hooks/transactions/useDeleteTransaction';
import { useAuthUser } from '../hooks/auth/useAuthUser';
import { useGetAllCustomer } from '../hooks/customers/useGetAllCustomer';
import { useGetAllPackages } from '../hooks/packages/useGetAllPackages';
import { dateFormat } from '../utils/dateFormat';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import Input from '../components/Input';
import AlertConfirm from '../components/AlertConfirm';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import SearchableDropdown from '../components/SearchableDropdown';

const TransactionsPage = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedDeleteTransaction, setSelectedDeleteTransaction] =
    useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: authUser } = useAuthUser();
  const { data: transactionResponse, isLoading: transactionIsLoading } =
    useGetAllTransactions({
      page,
      limit,
      search: searchTerm,
      status: statusFilter,
    });
  const { data: customerResponse } = useGetAllCustomer({ page: 1, limit: 100 });
  const { data: packageResponse } = useGetAllPackages();

  const customers = customerResponse?.data || [];
  const packages = packageResponse;
  const transactions = transactionResponse?.data || [];
  const totalTransactions = transactionResponse?.count || 0;
  const totalPages = Math.ceil(totalTransactions / limit);

  const { mutate: addTransaction, isPending: addPending } = useAddTransaction();
  const { mutate: updateTransaction, isPending: updatePending } =
    useUpdateTransaction();
  const { mutate: deleteTransaction, isPending: deletePending } =
    useDeleteTransaction();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedPackageId = watch('id_jenis_paket');
  const beratCucian = watch('berat_cucian');
  const [totalBiaya, setTotalBiaya] = useState(0);

  const selectedPkg = useMemo(
    () => packages?.find((pkg) => pkg.id_jenis_paket === selectedPackageId),
    [selectedPackageId, packages]
  );

  useEffect(() => {
    if (!selectedPkg || !beratCucian || beratCucian <= 0) {
      setTotalBiaya(0);
      setValue('total_biaya', 0);
      return;
    }

    const total = selectedPkg.harga_per_kg * parseFloat(beratCucian);
    setTotalBiaya(total);
    setValue('total_biaya', total);
  }, [selectedPkg, beratCucian, setValue]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  const handleAddOpenModal = () => {
    setModalType('add');
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (trx) => {
    setModalType('edit');
    setSelectedTransaction(trx);
    reset({
      id_pelanggan: trx.id_pelanggan,
      id_jenis_paket: trx.id_jenis_paket,
      berat_cucian: trx.berat_cucian,
      total_biaya: trx.total_biaya,
      status_cucian: trx.status_cucian,
    });
    setIsModalOpen(true);
  };

  const handleDeleteAlert = (trx) => setSelectedDeleteTransaction(trx);
  const handleCloseModal = () => setIsModalOpen(false);

  const onAddSubmit = async (data, e) => {
    e.preventDefault();
    try {
      await addTransaction({
        ...data,
        id_pengguna: authUser.user.id,
      });
      setShowToast({
        message: 'Transaksi berhasil ditambahkan',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({ message: err.message, variant: 'error' });
    } finally {
      setIsModalOpen(false);
      reset();
    }
  };

  const onEditSubmit = async (trx, e) => {
    e.preventDefault();
    try {
      await updateTransaction({
        id_transaksi: selectedTransaction.id_transaksi,
        ...trx,
      });
      setShowToast({
        message: 'Transaksi berhasil diubah',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({ message: err.message, variant: 'error' });
    } finally {
      setIsModalOpen(false);
      reset();
    }
  };

  const onDeleteTransaction = async () => {
    if (!selectedDeleteTransaction) return;
    try {
      await deleteTransaction(selectedDeleteTransaction.id_transaksi);
      setShowToast({
        message: 'Transaksi berhasil dihapus',
        variant: 'success',
      });
    } catch (err) {
      setShowToast({ message: err.message, variant: 'error' });
    } finally {
      setSelectedDeleteTransaction(null);
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
        isOpen={!!selectedDeleteTransaction}
        title={`Yakin ingin hapus transaksi dari pelanggan ${
          customerResponse?.data.find(
            (cust) =>
              cust.id_pelanggan === selectedDeleteTransaction?.id_pelanggan
          )?.nama_pelanggan
        }?`}
        onConfirm={onDeleteTransaction}
        confirmText={deletePending ? 'Menghapus...' : 'Hapus'}
        onCancel={() => setSelectedDeleteTransaction(null)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        confirmText={'Simpan'}
        title={
          modalType === 'add'
            ? 'Tambah Transaksi Cucian'
            : 'Edit Transaksi Cucian'
        }
        onConfirm={handleSubmit(
          modalType === 'add' ? onAddSubmit : onEditSubmit
        )}
        disabled={addPending || updatePending}
      >
        <form className='flex flex-col gap-3'>
          <div className='form-control'>
            <label className='label mb-2'>
              Pelanggan
            </label>
            <SearchableDropdown
              label='Pilih Pelanggan'
              data={customers}
              displayKey='nama_pelanggan'
              idKey='id_pelanggan'
              selectedItem={
                customers.find(
                  (c) => c.id_pelanggan === watch('id_pelanggan')
                ) || null
              }
              onSelect={(item) => setValue('id_pelanggan', item.id_pelanggan)}
              addButtonText='Tambah Pelanggan'
              addButtonLink='/customers'
            />
            {errors.id_pelanggan && (
              <span className='text-error text-sm'>
                {errors.id_pelanggan.message}
              </span>
            )}
          </div>

          <div className='form-control'>
            <label className='label mb-2'>
              Jenis Paket
            </label>
            <SearchableDropdown
              label='Pilih Jenis Paket'
              data={packages}
              displayKey='nama_paket'
              idKey='id_jenis_paket'
              selectedItem={
                packages?.find(
                  (p) => p.id_jenis_paket === watch('id_jenis_paket')
                ) || null
              }
              onSelect={(item) =>
                setValue('id_jenis_paket', item.id_jenis_paket)
              }
              addButtonText='Tambah Paket'
              addButtonLink='/package_settings'
            />
            {errors.id_jenis_paket && (
              <span className='text-error text-sm'>
                {errors.id_jenis_paket.message}
              </span>
            )}
          </div>

          <Input
            label='Berat Cucian (Kg)'
            type='number'
            placeholder='Masukkan berat cucian'
            register={register('berat_cucian', {
              required: 'Masukkan berat cucian!',
            })}
            error={errors.berat_cucian}
          />

          <Input
            label='Total Biaya'
            type='number'
            placeholder='Total otomatis dihitung'
            value={totalBiaya}
            readOnly
            disabled
          />

          <div className='label'>Status Cucian</div>
          <select
            className='select w-full'
            {...register('status_cucian', {
              required: 'Pilih status cucian!',
            })}
            defaultValue={selectedTransaction?.status_cucian || 'diproses'}
          >
            <option value='diproses'>Diproses</option>
            <option value='selesai, belum diambil'>
              Selesai, Belum Diambil
            </option>
            <option value='selesai, sudah diambil'>
              Selesai, Sudah Diambil
            </option>
          </select>
        </form>
      </Modal>

      <div className='my-4 flex flex-wrap justify-between items-center gap-2'>
        <button onClick={handleAddOpenModal} className='btn btn-success'>
          + Tambah Transaksi
        </button>

        <div className='flex gap-2 items-center'>
          <SearchBar
            placeholder='Cari transaksi...'
            onSearch={(value) => setSearchTerm(value)}
          />
          <select
            className='select select-bordered select-sm'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='semua'>Semua</option>
            <option value='diproses'>Diproses</option>
            <option value='selesai, belum diambil'>
              Selesai, Belum Diambil
            </option>
            <option value='selesai, sudah diambil'>
              Selesai, Sudah Diambil
            </option>
          </select>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <thead>
            <tr>
              <th>Pelanggan</th>
              <th>Paket</th>
              <th>Berat (Kg)</th>
              <th>Total Biaya</th>
              <th>Status</th>
              <th>Tanggal Masuk</th>
              <th>Tanggal Selesai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactionIsLoading ? (
              <tr>
                <td colSpan={8} className='text-center opacity-30'>
                  <Loading />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className='text-center opacity-30'>
                  Tidak ada data transaksi
                </td>
              </tr>
            ) : (
              transactions.map((trx) => (
                <tr key={trx.id_transaksi}>
                  <td>{trx.pelanggan?.nama_pelanggan}</td>
                  <td>{trx.jenis_paket?.nama_paket}</td>
                  <td>{trx.berat_cucian} Kg</td>
                  <td>Rp {Number(trx.total_biaya).toLocaleString('id-ID')}</td>
                  <td>{trx.status_cucian}</td>
                  <td>{dateFormat(trx.tanggal_masuk)}</td>
                  <td>
                    {trx.tanggal_selesai
                      ? dateFormat(trx.tanggal_selesai)
                      : '-'}
                  </td>
                  <td className='flex gap-2'>
                    <button
                      onClick={() => handleEditOpenModal(trx)}
                      className='btn btn-sm btn-warning'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(trx)}
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

export default TransactionsPage;
