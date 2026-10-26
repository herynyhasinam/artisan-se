import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Accueil from './pages/Accueil';
import Explorer from './pages/Explorer';
import Login from './pages/Login';
import Messages from './pages/Messages';
import MyArtisan from './pages/MyArtisan';
import Profile from './pages/Profile';
import Register from './pages/Register';

export default function App() {
  return (
    <Routes>
      {/* Pages publiques : mise en page divisée en 2 */}
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />

      {/* Application : réservée aux comptes connectés, avec la barre d'onglets */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/accueil" replace />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/ma-fiche" element={<ProtectedRoute role="ARTISAN"><MyArtisan /></ProtectedRoute>} />
        <Route path="*" element={<p>Page introuvable. <Link to="/accueil">Retour à l'accueil</Link></p>} />
      </Route>
    </Routes>
  );
}
