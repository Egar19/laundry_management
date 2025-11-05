import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Cari...' }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="form-control ">
      <div className="input-group">
        <input
          type="search"
          placeholder={placeholder}
          className="input input-bordered input-md w-full"
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
