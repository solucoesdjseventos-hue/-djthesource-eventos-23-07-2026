import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './NotFound.css';

const NotFound = () => (
  <div className="page-shell">
    <Header />
    <main className="notfound-page">
      <section className="notfound-card">
        <h2>Página não encontrada</h2>
        <p>Desculpe, a página que você procura não existe. Retorne ao início e escolha um serviço.</p>
        <Link to="/" className="back-home">Voltar para Home</Link>
      </section>
    </main>
  </div>
);

export default NotFound;
