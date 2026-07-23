import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import { services as defaultServices } from '../data/services';
import './Home.css';

const Home = () => {
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(true);
  const [showServices, setShowServices] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(() => setServices(defaultServices))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <Header />
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-media">
            <img
              src="/LED-moving-Head-3.png"
              alt="Moving head de iluminação para eventos"
              className="hero-image"
              loading="lazy"
            />
          </div>
          <div className="hero-copy">
            <p>DJ The Source</p>
            <h1>Orçamento completo para eventos e locação de serviços</h1>
            <p>Sonorização, iluminação, garçons, recepcionistas, DJs, decoradores e salão de acordo com convidados.</p>
            <button
              type="button"
              className="hero-button"
              onClick={() => setShowServices(prev => !prev)}
            >
              {showServices ? 'Ocultar serviços' : 'Ver serviços'}
            </button>
          </div>
        </section>
        <section id="services" className="services-carousel">
          {showServices && (
            <>
              <div className="carousel-header">
                <h2>Serviços</h2>
              </div>
              <div className="carousel-window">
                <div className="services-grid">
                  {loading ? (
                    <p>Carregando serviços...</p>
                  ) : (
                    services.map(service => (
                      <div key={service.id} className="carousel-slide">
                        <ServiceCard service={service} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
