import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { fetchServices, updateService, addService } from '../api/serviceApi';
import './Admin.css';

const Admin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchServices()
      .then(data => setServices(data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (id, field, value) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleUpdate = async (service) => {
    try {
      const updated = await updateService(service);
      setServices(prev => prev.map(s => (s.id === updated.id ? updated : s)));
      setMessage(`Serviço ${updated.title} atualizado com sucesso.`);
    } catch (err) {
      setMessage(err?.message || 'Erro ao atualizar serviço');
    }
  };

  const handleAddService = async () => {
    try {
      const created = await addService({
        title: 'Novo serviço',
        description: '',
        rateLabel: '',
        unitLabel: '',
        basePrice: 0,
        values: [],
        editable: true,
        hourly: false,
      });
      setServices(prev => [...prev, created]);
      setMessage(`Serviço ${created.title} criado com sucesso.`);
    } catch (err) {
      setMessage(err?.message || 'Erro ao criar serviço');
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
            <>
              <h3>📋 Serviços Configuráveis</h3>
              <div className="admin-grid">
                {services.map(service => (
                  <article key={service.id} className="admin-card">
                    <div className="admin-card-title">
                      <h3>{service.title}</h3>
                    </div>
                    <div className="admin-card-body">
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
                      <div className="admin-actions">
                        <button type="button" onClick={() => handleUpdate(service)}>Salvar</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <button type="button" onClick={handleAddService}>Adicionar serviço</button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Admin;
