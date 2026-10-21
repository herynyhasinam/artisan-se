import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Logo from './Logo';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <Link to="/" aria-label="Accueil Artis'Anse"><Logo /></Link>
      <nav className="nav">
        {user ? (
          <>
            {user.role === 'ARTISAN' && <Link to="/ma-fiche">Ma fiche</Link>}
            <button className="btn btn-ghost" onClick={logout}>Se déconnecter</button>
          </>
        ) : (
          <>
            <Link to="/connexion">Se connecter</Link>
            <Link to="/inscription" className="btn btn-primary">S'inscrire</Link>
          </>
        )}
      </nav>
    </header>
  );
}
