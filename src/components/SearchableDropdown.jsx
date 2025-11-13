import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchableDropdown = ({
  label = 'Pilih Item',
  data = [],
  displayKey = 'nama',
  idKey = 'id',
  selectedItem = null,
  onSelect = () => {},
  addButtonText = 'Tambah Data',
  addButtonLink = '/',
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredData =
    query === ''
      ? data
      : data.filter((item) =>
          item[displayKey].toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className='dropdown w-full'>
      <label tabIndex={0} className='btn w-full justify-between bg-base-100'>
        {selectedItem ? selectedItem[displayKey] : label}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 ml-2'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.356a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z'
            clipRule='evenodd'
          />
        </svg>
      </label>

      <div
        tabIndex={0}
        className='dropdown-content menu p-2 shadow bg-base-200 rounded-box w-full z-1'
      >
        <input
          type='text'
          placeholder='Cari...'
          className='input input-bordered w-full mb-2'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <ul className='max-h-48 overflow-y-auto'>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <li key={item[idKey]}>
                <button
                  className={`w-full text-left ${
                    selectedItem?.[idKey] === item[idKey]
                      ? 'bg-primary text-white'
                      : ''
                  }`}
                  onClick={() => onSelect(item)}
                >
                  {item[displayKey]}
                </button>
              </li>
            ))
          ) : (
            <li className='text-center opacity-60 py-2'>Tidak ditemukan</li>
          )}
        </ul>

        <button
          className='btn btn-ghost btn-primary mt-2 w-full'
          type='button'
          onClick={(e) => {
            e.preventDefault();
            navigate(addButtonLink, { replace: true });
          }}
        >
          + {addButtonText}
        </button>
      </div>
    </div>
  );
};

export default SearchableDropdown;
