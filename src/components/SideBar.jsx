import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useCurrentUser } from '../hooks/auth/useGetCurrentUser';
import Loading from './Loading';
import { useLogOut } from '../hooks/auth/useLogOut';

const SideBar = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const { mutate: logout, isPending } = useLogOut();

  if (error) return console.log(error.message);
  if (isPending) return <Loading />;

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  };

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  return (
    <div className='drawer-side'>
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
        </ul>

        <div className='mt-auto pt-4 border-t border-base-300'>
          <div className='flex justify-between'>
            <h2 className='font-bold text-secondary text-xl'>
              {isLoading ? <Loading /> : user.nama}
            </h2>
            <button
              onClick={() => {
                if (confirm('Yakin ingin keluar dari akun?')) logout();
              }}
              className='btn btn-error'
            >
              Keluar
            </button>
          </div>
          <label className='label-text font-semibold'>Ganti Tema</label>
          <select
            className='select select-bordered w-full mt-2'
            defaultValue={savedTheme}
            onChange={handleThemeChange}
          >
            <option value='light'>Terang</option>
            <option value='dark'>Gelap</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
