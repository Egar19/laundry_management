import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <select
      className='select select-bordered w-full mt-2'
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value='light'>Tema: Terang</option>
      <option value='dark'>Tema: Gelap</option>
    </select>
  );
};

export default ThemeSwitcher;
