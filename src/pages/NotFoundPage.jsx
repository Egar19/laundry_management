import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
      <h1 className="text-6xl font-bold text-error">404</h1>
      <p className="text-xl mt-3 mb-6 text-center">
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <Link to="/" className="btn btn-primary">
        Kembali
      </Link>
    </div>
  );
};

export default NotFoundPage;