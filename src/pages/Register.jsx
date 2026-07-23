import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { registerClient } from '../api/authApi';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setMessage('Preencha todos os campos para continuar.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas precisam ser iguais.');
      return;
    }

    try {
      const client = await registerClient({ name, email, password });
      localStorage.setItem('djClient', JSON.stringify({ name: client.name, email: client.email }));
      navigate('/');
    } catch (error) {
      setMessage(error.message || 'Falha ao cadastrar cliente.');
    }
  };

  return (
    <div className="page-shell">
      <Header />
      <main className="auth-page">
        <section className="auth-card">
          <h2>Cadastro de Cliente</h2>
          <p>Crie sua conta para acessar orçamentos e receber propostas personalizadas.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="name">Nome completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
            />
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
              placeholder="Digite uma senha segura"
            />
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
            />
            <button type="submit" className="auth-button">Cadastrar</button>
            {message && <p className="auth-message">{message}</p>}
          </form>
          <p className="auth-footer">
            Já tem conta? <Link to="/login">Faça login</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Register;
