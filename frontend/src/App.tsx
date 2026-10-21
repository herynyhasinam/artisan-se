import { Link, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import MyArtisan from './pages/MyArtisan';
import Register from './pages/Register';

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/connexion' || pathname === '/inscription';

  const routes = (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/ma-fiche" element={<ProtectedRoute role="ARTISAN"><MyArtisan /></ProtectedRoute>} />
      <Route path="*" element={<p>Page introuvable. <Link to="/">Retour à l'accueil</Link></p>} />
    </Routes>
  );

  // Les pages de connexion et d'inscription ont leur propre mise en page (pas de header)
  if (isAuthPage) return routes;

  return (
    <>
      <Header />
      <main className="container">{routes}</main>
    </>
  );
}
