import { useState } from 'react';
import { useGetTransactionByPhoneNumber } from '../hooks/transactions/useGetTransactionByPhoneNumber';
import Loading from '../components/Loading';
import { formatRupiah } from '../utils/rupiahFormat';
import { dateFormat } from '../utils/dateFormat';
import logo from '../assets/logo.png';
import { IoLogoWhatsapp } from 'react-icons/io';
import Toast from '../components/Toast';

const HomePage = () => {
  const [inputTelp, setInputTelp] = useState('');
  const [searchTelp, setSearchTelp] = useState('');
  const [showToast, setShowToast] = useState(null);

  const { data: hasil, isLoading } = useGetTransactionByPhoneNumber(searchTelp);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!inputTelp.trim()) {
      setShowToast({
        message: 'Nomor telepon tidak boleh kosong',
        variant: 'error',
      });
      return;
    }

    if (inputTelp.trim().length < 9) {
      setShowToast({
        message: 'Nomor telepon tidak boleh kurang dari 9',
        variant: 'error',
      });
      return;
    }
    
    if (inputTelp.trim().length > 13) {
      setShowToast({
        message: 'Nomor telepon tidak boleh lebih dari 12',
        variant: 'error',
      });
      return;
    }

    setSearchTelp(inputTelp.trim());
  };

  return (
    <div className='min-h-screen flex flex-col bg-base-200 overflow-x-hidden'>
      {showToast && (
        <Toast
          message={showToast.message}
          variant={showToast.variant}
          duration={5000}
          onClose={() => setShowToast(null)}
        />
      )}
      <nav className='navbar bg-base-100 shadow-sm px-6 sticky top-0 z-20'>
        <div className='flex-1'>
          <a className='text-2xl font-bold text-primary'>Yehning Laundry</a>
        </div>
        <div className='flex-none gap-4'>
          <a href='#cek' className='btn btn-ghost'>
            Cek Status
          </a>
          <a href='#contact' className='btn btn-primary btn-sm'>
            Kontak
          </a>
        </div>
      </nav>

      <section className='hero py-16 bg-base-100'>
        <div className='hero-content flex-col lg:flex-row'>
          <img
            src={logo}
            className='w-full max-w-xs rounded-xl shadow-xl mx-auto'
          />

          <div className='lg:ml-10 text-center lg:text-left'>
            <h1 className='text-4xl font-bold text-primary leading-snug'>
              Cepat • Bersih • Wangi ✨
            </h1>
            <p className='py-4 text-lg opacity-70'>
              Cek status cucian Anda secara real-time tanpa login. Cukup
              masukkan nomor telepon!
            </p>

            <a href='#cek' className='btn btn-primary mt-3'>
              Cek Status Sekarang
            </a>
          </div>
        </div>
      </section>

      <section id='cek' className='py-16 px-4'>
        <div className='max-w-xl mx-auto bg-base-100 p-6 shadow-lg rounded-2xl'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Cek Status Cucian
          </h2>

          <form onSubmit={handleCheck} className='flex flex-col gap-4'>
            <input
              type='text'
              inputMode='numeric'
              pattern="[0-9]*"
              placeholder='Masukkan nomor telepon'
              className='input input-bordered w-full'
              value={inputTelp}
              onChange={(e) => setInputTelp(e.target.value.replace(/\D/g, ''))}
            />

            <button className='btn btn-primary w-full'>Cek Sekarang</button>
          </form>

          <div className='mt-6'>
            {isLoading ? (
              <div className='text-center py-4'>
                <Loading />
              </div>
            ) : hasil && hasil.length > 0 ? (
              <div className='space-y-4'>
                {hasil.map((trx) => (
                  <div
                    key={trx.id_transaksi}
                    className='p-4 rounded-xl border shadow-sm bg-base-100'
                  >
                    <h3 className='font-bold text-primary mb-2 text-lg'>
                      {trx.nama_pelanggan}
                    </h3>

                    <div className='space-y-1 text-sm'>
                      <p>
                        Paket: <b>{trx.jenis_paket?.nama_paket}</b>
                      </p>
                      <p>Berat: {trx.berat_cucian} Kg</p>
                      <p>Total: {formatRupiah(trx.total_biaya)}</p>
                      <p>
                        Status: <b>{trx.status_cucian}</b>
                      </p>
                      <p>Masuk: {dateFormat(trx.tanggal_masuk)}</p>
                      <p>
                        Selesai:{' '}
                        {trx.tanggal_selesai
                          ? dateFormat(trx.tanggal_selesai)
                          : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTelp ? (
              <p className='text-center opacity-70 mt-4'>
                Tidak ada transaksi dengan nomor tersebut.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <footer
        id='cosntact'
        className='footer footer-center p-10 bg-base-300 mt-auto flex justify-between md:flex-row flex-col gap-4'
      >
        <h2 className='text-xl font-bold'>Hubungi Kami 📞</h2>
        <p>
          No Telp: <b>087701885354</b>
        </p>
        <p>
          No WA: <b>083119398596</b>
        </p>
        <p>Alamat: Jl. Ir Soekarno, Tampaksiring, Gianyar</p>
        <p className='opacity-70'>
          © {new Date().getFullYear()} Yehning Laundry
        </p>
      </footer>
      <a
        href='https://wa.me/6283119398596'
        target='_blank'
        rel='noopener noreferrer'
        className='btn btn-success btn-circle fixed bottom-6 right-6 shadow-lg'
      >
        <IoLogoWhatsapp size={28} />
      </a>
    </div>
  );
};

export default HomePage;
