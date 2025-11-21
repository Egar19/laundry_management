import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useCurrentUser } from '../hooks/auth/useGetCurrentUser';
import Loading from './Loading';
import { useLogOut } from '../hooks/auth/useLogOut';
import AlertConfirm from './AlertConfirm';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const SideBar = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const { mutate: logout, isPending } = useLogOut();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  if (error) return console.log(error.message);
  if (isPending) return <Loading />;

  const handleLogOut = () => {
    logout();
    setIsAlertOpen(false)
  };

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  return (
    <div className='drawer-side'>
      <AlertConfirm 
        isOpen={isAlertOpen}
        title={'Yakin ingin keluar dari sistem?'}
        confirmText='Ya'
        cancelText='Tidak'
        onConfirm={handleLogOut}
        onCancel={() => setIsAlertOpen(false)}
      />
      <label htmlFor='my-drawer' className='drawer-overlay'></label>

      <div className='flex flex-col bg-base-200 min-h-screen w-64 p-4'>
        <Link to='/'>
          <img className='w-12 rounded-full mb-4' src={logo} alt='logo' />
        </Link>

        <ul className='menu  flex-1'>
          <li>
            <NavLink
              to='/dashboard'
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/transactions'
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Transaksi
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/customers'
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Pelanggan
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/expenses'
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Pengeluaran
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/reports'
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Laporan
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/package_settings'
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Pengaturan paket
            </NavLink>
          </li>
          {user?.peran === 'admin' && (
            <li>
              <NavLink
                to='/users'
                className={({ isActive }) =>
                  isActive ? 'text-primary font-bold' : ''
                }
              >
                List Pengguna
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to='/'
              className={({ isActive }) =>
                isActive ? 'text-primary font-bold' : ''
              }
            >
              Halaman Utama
            </NavLink>
          </li>
        </ul>

        <div className='mt-auto pt-4 border-t border-base-300'>
          <div
            tabIndex={0}
            className='collapse collapse-arrow bg-base-100 border-base-300'
          >
            <div className='collapse-title font-semibold text-secondary'>
              {isLoading ? <Loading /> : user.nama}
            </div>
            <div className='collapse-content text-sm'>
              <button
                onClick={() => {setIsAlertOpen(true)}}
                className='btn btn-error'
              >
                Keluar
              </button>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
