import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Cari...' }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="form-control max-w-md">
      <div className="input-group">
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered input-sm w-full"
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
