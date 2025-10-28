import { useLocation } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { MdMenu } from 'react-icons/md';

const MainLayout = ({ children }) => {
  const location = useLocation();

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/transactions': 'Transaksi',
    '/customers': 'Pelanggan',
    '/expenses': 'Pengeluaran',
    '/reports': 'Laporan',
    '/users': 'List pengguna',
  };

  const currentTitle = pageTitles[location.pathname];

  return (
    <div className='drawer lg:drawer-open'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <SideBar />

      <div className='drawer-content flex flex-col'>
        <div className='w-full flex gap-4 items-center p-4 bg-base-100 shadow'>
          <label htmlFor='my-drawer' className='cursor-pointer lg:hidden'>
            <MdMenu size={24} />
          </label>
          <h1 className='font-bold text-xl'>{currentTitle}</h1>
        </div>

        <main className='p-4'>{children}</main>
      </div>

    </div>
  );
};

export default MainLayout;
