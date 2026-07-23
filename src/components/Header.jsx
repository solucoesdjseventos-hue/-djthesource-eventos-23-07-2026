import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [authClient, setAuthClient] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('djClient');
    if (stored) {
      setAuthClient(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('djClient');
    setAuthClient(null);
    navigate('/');
  };

  const baseUrl = import.meta.env.BASE_URL;

  return (
    <header className="header">
      <div className="brand">
        <div
          className="brand-logo"
          aria-label="Logo DJ The Source"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <img
            src={`${baseUrl}LED-moving-Head-3.png`}
            alt="DJ The Source"
            className="brand-image"
          />
          <span className="hamburger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <div className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
            <Link to="/admin" className="hamburger-menu-item">Admin</Link>
          </div>
        </div>
        <Link to="/" className="brand-title">DJ The Source</Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/servico/sonorizacao">Sonorização</Link>
        <Link to="/servico/iluminacao">Iluminação</Link>
        <Link to="/servico/garcons">Garçons</Link>
        <Link to="/servico/recepcionistas">Recepcionistas</Link>
        <Link to="/servico/djs">DJs</Link>
        <Link to="/servico/decoracao">Decorador</Link>
        <Link to="/servico/salao">Salão</Link>
        <Link to="/orcamento">Orçamento</Link>
        {authClient ? (
          <div className="auth-actions">
            <span className="auth-welcome">Olá, {authClient.name}</span>
            <button type="button" className="logout-button" onClick={handleLogout}>Sair</button>
          </div>
        ) : (
          <>
            <Link to="/register">Cadastra-se</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
