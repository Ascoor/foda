import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'لوحة التحكم' },
  { to: '/voters', label: 'الناخبون' },
  { to: '/committees', label: 'اللجان' },
  { to: '/agents', label: 'المندوبون' },
  { to: '/reports', label: 'التقارير' },
  { to: '/activities', label: 'الأنشطة' },
  { to: '/map', label: 'الخريطة' }
];

const Sidebar = () => (
  <aside className="hidden w-64 flex-shrink-0 border-s border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
    <h1 className="mb-8 text-2xl font-bold text-primary">Elections360</h1>
    <nav className="space-y-3">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block rounded px-3 py-2 text-sm font-medium transition hover:bg-primary/10 dark:text-slate-200 ${
              isActive ? 'bg-primary/10 text-primary-dark dark:bg-primary/20' : 'text-slate-700'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
