import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-dark focus:outline-none"
        onClick={() => setIsDark((prev) => !prev)}
      >
        {isDark ? 'وضع النهار' : 'الوضع الليلي'}
      </button>
      <nav className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
        <Link to="/settings">الإعدادات</Link>
        <Link to="/profile">الملف الشخصي</Link>
      </nav>
    </header>
  );
};

export default Navbar;
