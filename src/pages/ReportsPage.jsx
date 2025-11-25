import { useState } from 'react';
import { exportToExcel } from '../utils/exportToExcel';

// HOOKS
import { useExportTransactions } from '../hooks/transactions/useExportTransactions';
import { useExportExpenses } from '../hooks/expenses/useExportExpenses';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

const ReportsPage = () => {
  const [trxMulai, setTrxMulai] = useState('');
  const [trxSampai, setTrxSampai] = useState('');

  const [expMulai, setExpMulai] = useState('');
  const [expSampai, setExpSampai] = useState('');

  const [showToast, setShowToast] = useState(null);

  const { data: trxData, isLoading: trxLoading } = useExportTransactions(
    trxMulai,
    trxSampai
  );

  const { data: expData, isLoading: expLoading } = useExportExpenses(
    expMulai,
    expSampai
  );

  const handleExportTransactions = () => {
    if (!trxMulai || !trxSampai) {
      return setShowToast({
        message: 'Isi tanggal transaksi terlebih dahulu!',
        variant: 'error',
      });
    }

    if (!trxData || trxData.length === 0) {
      return setShowToast({
        message: `Tidak ada transaksi antara tanggal ${trxMulai} sampai ${trxSampai}`,
        variant: 'error',
      });
    }

    if (trxMulai > trxSampai) {
      return setShowToast({
        message: 'Tanggal transaksi tidak valid!',
        variant: 'error',
      });
    }

    if (trxData) {
      exportToExcel(trxData, 'Laporan_Transaksi');
      setShowToast({
        message: 'Berhasil export laporan transaksi!',
        variant: 'success',
      });
    }
  };

  const handleExportExpenses = () => {
    if (!expMulai || !expSampai) {
      return setShowToast({
        message: 'Isi tanggal pengeluaran terlebih dahulu!',
        variant: 'error',
      });
    }

    if (!expData || expData.length === 0) {
      return setShowToast({
        message: `Tidak ada pengeluaran antara tanggal ${expMulai} sampai ${expSampai}`,
        variant: 'error',
      });
    }

    if (expMulai > expSampai) {
      return setShowToast({
        message: 'Tanggal pengeluaran tidak valid!',
        variant: 'error',
      });
    }

    if (expData) {
      exportToExcel(expData, 'Laporan_Pengeluaran');
      setShowToast({
        message: 'Berhasil export laporan pengeluaran!',
        variant: 'success',
      });
    }
  };

  return (
    <div className='p-4 space-y-6'>
      {showToast && (
        <Toast
          message={showToast.message}
          variant={showToast.variant}
          duration={5000}
          onClose={() => setShowToast(null)}
        />
      )}

      <h1 className='text-3xl font-bold'>Laporan Transaksi & Pengeluaran</h1>
      <p className='opacity-70 mb-6'>
        Ekspor laporan dalam bentuk Excel untuk kebutuhan administrasi.
      </p>

      <div className='bg-base-300 p-6 rounded-lg shadow-md space-y-6'>
        <h2 className='text-xl font-bold'>Laporan Transaksi Cucian</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='tglTrxMulai' className='label-text font-semibold'>
              Dari tanggal
            </label>
            <input
              id='tglTrxMulai'
              type='date'
              className='input input-bordered w-full'
              value={trxMulai}
              onChange={(e) => setTrxMulai(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='tglTrxSampai' className='label-text font-semibold'>
              Sampai tanggal
            </label>
            <input
              id='tglTrxSampai'
              type='date'
              className='input input-bordered w-full'
              value={trxSampai}
              onChange={(e) => setTrxSampai(e.target.value)}
            />
          </div>

          <button
            className='btn btn-secondary w-full'
            onClick={handleExportTransactions}
          >
            {trxLoading ? <Loading /> : 'Export Custom Transaksi'}
          </button>
        </div>
      </div>

      <div className='bg-base-300 p-6 rounded-lg shadow-md space-y-6'>
        <h2 className='text-xl font-bold'>Laporan Pengeluaran</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
          <div className='flex flex-col gap-1'>
            <label className='label-text font-semibold'>Dari tanggal</label>
            <input
              type='date'
              className='input input-bordered w-full'
              value={expMulai}
              onChange={(e) => setExpMulai(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='label-text font-semibold'>Sampai tanggal</label>
            <input
              type='date'
              className='input input-bordered w-full'
              value={expSampai}
              onChange={(e) => setExpSampai(e.target.value)}
            />
          </div>

          <button
            className='btn btn-secondary w-full'
            onClick={handleExportExpenses}
          >
            {expLoading ? <Loading /> : 'Export Custom Pengeluaran'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
