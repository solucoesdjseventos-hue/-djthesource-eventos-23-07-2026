import { useEffect, useState } from 'react';
import Header from '../components/Header';
import './Quote.css';





const Quote = () => {
  const [quote, setQuote] = useState({
    items],
    total,
    salon,
    clientName,
    eventName,
    clientEmail,
    clientPhone);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top, behavior);
  };

  useEffect(() => {
    const stored = localStorage.getItem('djQuote');
    if (stored) {
      const storedQuote = JSON.parse(stored);
      setQuote({
        items],
        total,
        salon,
        clientName,
        eventName,
        clientEmail,
        clientPhone);
    }
  }, []);

  const updateQuoteField = (field, 'items' | 'total' | 'salon'>, value) => {
    const next = { ...quote, [field];
    setQuote(next);
    localStorage.setItem('djQuote', JSON.stringify(next));
  };

  const sendQuote = async () => {
    try {
      const response = await fetch('/api/quote', {
        method,
        headers,
        body,
          clientName,
          clientEmail,
          clientPhone,
          organizerEmail,
          quote
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao enviar orçamento');
      }

      setMessage('Orçamento enviado com sucesso ao organizador!');
    } catch (error) {
      setMessage(`Falha ao enviar);
    }
  };

  return (
    <div className="page-shell">
      <Header />
      <main className="quote-page">
        <section className="quote-summary">
          <div className="quote-content">
            <div className="quote-header">
              <h2>Orçamento do Evento</h2>
              <div className="quote-total-badge">
                <span>Total</span>
                <p className="total-value">R$ {quote.total.toFixed(2)}</p>
              </div>
            </div>

            {quote.items.length > 0 && (
              <div className="quote-summary-info">
                <div className="info-item">
                  <span className="info-label">Salão:</span>
                  <span className="info-value">{quote.salon || '—'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Evento:</span>
                  <span className="info-value">{quote.eventName || '—'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cliente:</span>
                  <span className="info-value">{quote.clientName || '—'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Contato:</span>
                  <span className="info-value">{quote.clientEmail || '—'}</span>
                </div>
              </div>
            )}

            <div className="quote-items">
              {quote.items.length ? (
                <>
                  <h3 className="items-title">Serviços Adicionados</h3>
                  {quote.items.map(item => (
                    <article key={item.id} className="quote-item">
                      <div className="quote-item-header">
                        <h4>{item.title}</h4>
                        <strong className="item-price">R$ {item.total.toFixed(2)}</strong>
                      </div>
                      <p className="item-info">{item.info}</p>
                    </article>
                  ))}
                </>
              ) : (
                <div className="empty-quote">
                  <p>📋 Nenhum serviço adicionado ao orçamento ainda.</p>
                  <p className="empty-hint">Adicione serviços para gerar seu orçamento!</p>
                </div>
              )}
            </div>

            <form className="quote-send" onSubmit={(e) => { e.preventDefault(); sendQuote(); }}>
              <div className="form-section">
                <h3>Informações do Cliente</h3>
                <div className="form-group">
                  <label htmlFor="clientName">Nome do cliente</label>
                  <input
                    id="clientName"
                    type="text"
                    value={quote.clientName}
                    placeholder="Ex: João Silva"
                    onChange={e => updateQuoteField('clientName', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="clientEmail">Email</label>
                    <input
                      id="clientEmail"
                      type="email"
                      value={quote.clientEmail}
                      placeholder="cliente@exemplo.com"
                      onChange={e => updateQuoteField('clientEmail', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clientPhone">Telefone</label>
                    <input
                      id="clientPhone"
                      type="tel"
                      value={quote.clientPhone}
                      placeholder="(11) 91234-5678"
                      onChange={e => updateQuoteField('clientPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Informações do Evento</h3>
                <div className="form-group">
                  <label htmlFor="eventName">Nome do evento</label>
                  <input
                    id="eventName"
                    type="text"
                    value={quote.eventName}
                    placeholder="Ex, Aniversário"
                    onChange={e => updateQuoteField('eventName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="organizerEmail">Email do organizador</label>
                  <input
                    id="organizerEmail"
                    type="email"
                    value={email}
                    placeholder="organizador@exemplo.com"
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={!quote.items.length || !email || !quote.clientName || !quote.clientEmail}
              >
                ✓ Enviar Orçamento
              </button>
              {message && <p className={`quote-message ${message.includes('sucesso') ? 'success' : 'error'}`}>{message}</p>}
            </form>
          </div>

          <div className="service-image-container">
            <div className="image-frame">
              <img
                src="/orcamentoeventos.webp"
                alt="Orçamento de eventos"
                className="service-title-image"
              />
            </div>
          </div>
        </section>
        <div className="quote-footer">
          <button type="button" className="back-to-top" onClick={scrollToTop}>
            ↑ Voltar ao topo
          </button>
        </div>
      </main>
    </div>
  );
};

export default Quote;
