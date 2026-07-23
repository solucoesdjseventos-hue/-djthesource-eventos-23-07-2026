import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { fetchServices, updateService, addService } from '../api/serviceApi';
import { services as defaultServices } from '../data/services';
import './Admin.css';

const Admin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loadingSavedQuotes, setLoadingSavedQuotes] = useState(false);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices(defaultServices))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (id, field, value) => {
    setServices(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleUpdate = async (service) => {
    try {
      const updated = await updateService(service);
      setServices(prev => prev.map(item => (item.id === updated.id ? updated : item)));
      setMessage(`Serviço ${updated.title || 'não informado'} atualizado com sucesso.`);
    } catch (err) {
      setMessage(err?.message || 'Falha ao atualizar serviço.');
    }
  };

  const fetchSavedQuotes = async () => {
    setLoadingSavedQuotes(true);
    try {
      const res = await fetch('/api/quotes');
      if (!res.ok) throw new Error('Falha ao buscar orçamentos');
      const data = await res.json();
      setSavedQuotes(data);
    } catch (err) {
      setMessage('Falha ao carregar orçamentos do backend. Verifique sua conexão ou configuração do Supabase.');
    } finally {
      setLoadingSavedQuotes(false);
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Confirma exclusão deste orçamento?')) return;
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao excluir orçamento');
      }
      setSavedQuotes(prev => prev.filter(q => q.id !== id));
      setMessage('Orçamento excluído com sucesso.');
    } catch (err) {
      setMessage(err?.message || 'Falha ao excluir orçamento via backend.');
    }
  };

  const handleAddService = async () => {
    try {
      const created = {
        title: 'Novo serviço',
        description: '',
        rateLabel: '',
        unitLabel: '',
        basePrice: 0,
        values: [],
        hourly: false,
        options: [],
      };
      const result = await addService(created);
      setServices(prev => [...prev, result]);
      setMessage(`Serviço ${result.title || 'novo'} adicionado com sucesso.`);
    } catch (err) {
      setMessage(err?.message || 'Falha ao adicionar serviço.');
    }
  };

  return (
    <div className="page-shell">
      <Header />
      <main className="admin-page">
        <section className="admin-panel">
          <h2>⚙️ Painel de Administração</h2>
          <p>Gerenciamento de pacotes e orçamentos de eventos</p>

          {message && <div className="admin-message">{message}</div>}

          {loading ? (
            <p>Carregando serviços...</p>
          ) : (
            <div className="admin-grid">
              {services.map(service => (
                <article key={service.id} className="admin-card">
                  <h3>{service.title || 'Serviço sem nome'}</h3>
                  <label>
                    Nome do serviço
                    <input
                      value={service.title || ''}
                      onChange={e => handleChange(service.id, 'title', e.target.value)}
                    />
                  </label>
                  <label>
                    Descrição
                    <textarea
                      rows={3}
                      value={service.description || ''}
                      onChange={e => handleChange(service.id, 'description', e.target.value)}
                    />
                  </label>
                  <button type="button" onClick={() => handleUpdate(service)}>
                    Salvar serviço
                  </button>
                </article>
              ))}
            </div>
          )}

          <section className="admin-saved-quotes">
            <h3>Orçamentos salvos</h3>
            <button type="button" onClick={fetchSavedQuotes} disabled={loadingSavedQuotes}>
              {loadingSavedQuotes ? 'Atualizando...' : 'Atualizar orçamentos'}
            </button>

            {savedQuotes.length === 0 ? (
              <p>Nenhum orçamento salvo encontrado.</p>
            ) : (
              <div className="admin-quote-items">
                {savedQuotes.map((quote) => (
                  <div key={quote.id} className="admin-quote-item">
                    <div>
                      <strong>{quote.clientName || 'Cliente não informado'}</strong>
                      <p>{quote.clientEmail || 'Sem email'}</p>
                    </div>
                    <button type="button" onClick={() => handleDeleteQuote(quote.id)}>
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <button type="button" onClick={handleAddService} className="admin-add-service">
            Adicionar novo serviço
          </button>
        </section>
      </main>
    </div>
  );
};

export default Admin;
