import Stat from '../components/Stat';
import { useCustomerCount } from '../hooks/customers/useCustomerCount';
import Loading from '../components/Loading';
import { useExpenseCount } from '../hooks/expenses/useExpenseCount';
import { useTransactionCount } from '../hooks/transactions/useTransactionCount';
import { useGetTransactionMonthlyTotals } from '../hooks/transactions/useGetTransactionMonthlyTotals';
import { useGetExpenseMonthlyTotals } from '../hooks/expenses/useGetExpenseMonthlyTotals';
import { formatRupiah } from '../utils/rupiahFormat';
import { useGetAllPackages } from '../hooks/packages/useGetAllPackages';

const DashboardPage = () => {
  const { data: transactionCount, isLoading: transactionLoading } =
    useTransactionCount();
  const { data: customerCount, isLoading: customerLoading } =
    useCustomerCount();
  const { data: expenseCount, isLoading: expenseLoading } = useExpenseCount();
  const { data: transactionTotals, isLoading: transactionTotalsIsLoading } =
    useGetTransactionMonthlyTotals();
  const { data: expenseTotals, isLoading: expenseTotalsIsLoading } =
    useGetExpenseMonthlyTotals();
  const { data: packages, isLoading: packagesLoading } = useGetAllPackages();

  return (
    <div className='flex flex-col gap-4'>
      <div className='p-4 flex flex-col bg-base-300 rounded gap-4'>
        <h1 className='text-2xl font-bold'>Transaksi Cucian</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4'>
          <Stat
            btnText='Lihat'
            link='/transactions'
            title='Total transaksi cucian'
            value={transactionLoading ? <Loading /> : transactionCount.total}
          />
          <Stat
            btnText='Lihat'
            link='/transactions'
            title='Total cucian diproses'
            value={transactionLoading ? <Loading /> : transactionCount.diproses}
          />
          <Stat
            btnText='Lihat'
            link='/transactions'
            title='Total cucian belum diambil'
            value={
              transactionLoading ? (
                <Loading />
              ) : (
                transactionCount.selesai_belum_diambil
              )
            }
          />
          <Stat
            btnText='Lihat'
            link='/transactions'
            title='Total cucian sudah diambil'
            value={
              transactionLoading ? (
                <Loading />
              ) : (
                transactionCount.selesai_sudah_diambil
              )
            }
          />
        </div>
      </div>

      <div className='p-4 flex flex-col bg-base-300 rounded gap-4'>
        <h1 className='text-2xl font-bold'>Pemasukan dan Pengeluaran</h1>
        <div className='tabs tabs-border'>
          <input
            type='radio'
            name='my_tabs_2'
            className='tab mb-2'
            aria-label='Bulan ini'
            defaultChecked
          />
          <div className='tab-content'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
              <Stat
                btnText='Lihat'
                link='/transactions'
                title='Total pemasukan dari transaksi cucian bulan ini'
                value={
                  transactionTotalsIsLoading ? (
                    <Loading />
                  ) : (
                    formatRupiah(transactionTotals.this_month)
                  )
                }
              />
              <Stat
                btnText='Lihat'
                link='/expenses'
                title='Total pengeluaran bulan ini'
                value={
                  expenseTotalsIsLoading ? (
                    <Loading />
                  ) : (
                    formatRupiah(expenseTotals.this_month)
                  )
                }
              />
              <Stat
                btnText='Lihat'
                link='/expenses'
                title='Selisih pemasukan dan pengeluaran bulan ini'
                value={
                  transactionTotalsIsLoading || expenseTotalsIsLoading ? (
                    <Loading />
                  ) : (
                    formatRupiah(transactionTotals.this_month - expenseTotals.this_month)
                  )
                }
              />
            </div>
          </div>

          <input
            type='radio'
            name='my_tabs_2'
            className='tab mb-2'
            aria-label='Satu Bulan Yang Lalu'
          />
          <div className='tab-content'>
            <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4'>
              <Stat
                btnText='Lihat'
                link='/transactions'
                title='Total pemasukan dari transaksi cucian bulan lalu'
                value={
                  transactionTotalsIsLoading ? (
                    <Loading />
                  ) : (
                    formatRupiah(transactionTotals.last_month)
                  )
                }
              />
              <Stat
                btnText='Lihat'
                link='/expenses'
                title='Total pengeluaran bulan lalu'
                value={
                  expenseTotalsIsLoading ? (
                    <Loading />
                  ) : (
                    formatRupiah(expenseTotals.last_month)
                  )
                }
              />
              <Stat
                btnText='Lihat'
                link='/expenses'
                title='Selisih pemasukan dan pengeluaran bulan lalu'
                value={
                  transactionTotalsIsLoading || expenseTotalsIsLoading ? (
                    <Loading />
                  ) : (
                    formatRupiah(transactionTotals.last_month - expenseTotals.last_month)
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
        <div className='space-y-4 bg-base-300 p-4 rounded'>
          <h1 className='text-2xl font-bold'>Pengeluaran</h1>
          <Stat
            btnText='Lihat'
            link='/expenses'
            title='Total jenis pengeluaran'
            value={expenseLoading ? <Loading /> : expenseCount}
          />
        </div>

        <div className='space-y-4 bg-base-300 p-4 rounded'>
          <h1 className='text-2xl font-bold'>Pelanggan</h1>
          <Stat
            btnText='Lihat'
            link='/customers'
            title='Total pelanggan'
            value={customerLoading ? <Loading /> : customerCount}
          />
        </div>

        <div className='space-y-4 bg-base-300 p-4 rounded sm:col-span-2 md:col-span-1'>
          <h1 className='text-2xl font-bold'>Paket layanan</h1>
          <Stat
            btnText='Lihat'
            link='/packages_settings'
            title='Total jenis paket'
            value={packagesLoading ? <Loading /> : packages.length}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
