import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Logo from './Logo';
import { BriefcaseIcon, ChatIcon, HomeIcon, SearchIcon, UserIcon } from './icons';

// Barre d'onglets en bas sur mobile, menu latéral sur ordinateur.
export default function AppLayout() {
  const { user } = useAuth();

  const tabs = [
    { to: '/accueil', label: 'Accueil', icon: <HomeIcon /> },
    { to: '/explorer', label: 'Explorer', icon: <SearchIcon /> },
    ...(user?.role === 'ARTISAN'
      ? [{ to: '/ma-fiche', label: 'Ma fiche', icon: <BriefcaseIcon /> }]
      : []),
    { to: '/messages', label: 'Messages', icon: <ChatIcon /> },
    { to: '/profil', label: 'Profil', icon: <UserIcon /> },
  ];

  return (
    <div className="app">
      <header className="topbar"><Logo size={32} /></header>

      <nav className="tabbar" aria-label="Navigation principale">
        <div className="tabbar-logo"><Logo size={36} /></div>
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
            {t.icon}
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="content">
        <div className="content-inner"><Outlet /></div>
      </main>
    </div>
  );
}
