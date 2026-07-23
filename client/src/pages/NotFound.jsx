import Header from '../components/Header';
import './NotFound.css';

const NotFound = () => (
  <div className="page-shell">
    <Header />
    <main className="notfound-page">
      <section className="notfound-card">
        <h2>Página não encontrada</h2>
        <p>Desculpe, a página que você procura não existe. Retorne ao início e escolha um serviço.</p>
        <a href="/" className="back-home">Voltar para Home</a>
      </section>
    </main>
  </div>
);

export default NotFound;
