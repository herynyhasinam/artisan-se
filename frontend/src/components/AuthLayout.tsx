import { ReactNode } from 'react';
import Logo from './Logo';

// Écran divisé en 2 : le logo et le nom à gauche, le formulaire à droite.
// Sur mobile, la partie gauche passe en bandeau au-dessus du formulaire.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-split">
      <aside className="auth-brand">
        <Logo size={56} />
      </aside>
      <section className="auth-panel">{children}</section>
    </div>
  );
}
