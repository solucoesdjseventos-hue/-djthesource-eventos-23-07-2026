import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { loginClient } from '../api/authApi';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('Informe e-mail e senha para continuar.');
      return;
    }

    try {
      const client = await loginClient({ email, password });
      localStorage.setItem('djClient', JSON.stringify({ name: client.name, email: client.email }));
      navigate('/');
    } catch (error) {
      setMessage(error.message || 'Falha no login.');
    }
  };

  return (
    <div className="page-shell">
      <Header />
      <main className="auth-page">
        <section className="auth-card">
          <h2>Login de Cliente</h2>
          <p>Entre com sua conta para acessar orçamentos e enviar pedidos.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@exemplo.com"
            />
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
            <button type="submit" className="auth-button">Entrar</button>
            {message && <p className="auth-message">{message}</p>}
          </form>
          <p className="auth-footer">
            Ainda não tem conta? <Link to="/register">Cadastre-se aqui</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;
