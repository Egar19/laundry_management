const Pagination = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <div className='flex justify-between items-center mt-4'>
      <button
        className='btn btn-sm'
        onClick={onPrev}
        disabled={page === 1}
      >
        « Sebelumnya
      </button>

      <span className='text-sm opacity-70'>
        Halaman {page} dari {totalPages || 1}
      </span>

      <button
        className='btn btn-sm'
        onClick={onNext}
        disabled={page === totalPages}
      >
        Selanjutnya »
      </button>
    </div>
  );
};

export default Pagination;
