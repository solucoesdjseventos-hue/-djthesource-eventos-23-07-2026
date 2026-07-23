import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { fetchServices, updateService, addService } from '../api/serviceApi';

import './Admin.css';





const Admin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [quoteExists, setQuoteExists] = useState(false);
  const [storedQuote, setStoredQuote] = useState(null);
  const [collapsed, setCollapsed] = useState>({});
  const [expandedQuoteItems, setExpandedQuoteItems] = useState>({});
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loadingSavedQuotes, setLoadingSavedQuotes] = useState(false);
  const [quoteDetailsOpen, setQuoteDetailsOpen] = useState>({});
  const [newService, setNewService] = useState({
    title,
    description,
    rateLabel,
    unitLabel,
    basePrice,
    values,0',
    hourly);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));

    const storedQuoteText = localStorage.getItem('djQuote');
    if (storedQuoteText) {
      const quoteData: QuoteData = JSON.parse(storedQuoteText);
      setQuoteExists(true);
      setStoredQuote(quoteData);
    }
  }, []);

  const handleClearQuote = () => {
    localStorage.removeItem('djQuote');
    setQuoteExists(false);
    setStoredQuote(null);
    setMessage('Orçamento excluído com sucesso.');
  };

  const fetchSavedQuotes = async () => {
    setLoadingSavedQuotes(true);
    try {
      const res = await fetch('/api/quotes');
      if (!res.ok) throw new Error('Falha ao buscar orçamentos');
      const data = await res.json();
      setSavedQuotes(data);
    } catch (err) {
      setMessage(err.message || 'Erro ao carregar orçamentos');
    } finally {
      setLoadingSavedQuotes(false);
    }
  };

  const toggleQuoteDetails = (id) => {
    setQuoteDetailsOpen(prev => ({ ...prev, [id]] }));
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Confirma exclusão deste orçamento?')) return;
    try {
      const res = await fetch(`/api/quotes/${id}`, { method);
      if (res.status === 204) {
        setMessage('Orçamento excluído com sucesso.');
        fetchSavedQuotes();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Falha ao excluir orcamento');
      }
    } catch (err) {
      setMessage(err.message || 'Erro ao excluir orcamento');
    }
  };

  const toggleQuoteItem = (itemId) => {
    setExpandedQuoteItems(prev => ({ ...prev, [itemId]] }));
  };

  const handleChange = (id, field, value) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, [field]));
  };

  const handleOptionChange = (serviceId, optionIndex, field, value) => {
    setServices(prev => prev.map(service => {
      if (service.id !== serviceId || !service.options) {
        return service;
      }

      const updatedOption: ServiceOption = field === 'price'
        ? { ...service.options![optionIndex], price) }
        ], [field]) };

      return {
        ...service,
        options, index) => index === optionIndex ? updatedOption )
      };
    }));
  };

  const handleAddOption = (serviceId) => {
    setServices(prev => prev.map(service => service.id === serviceId ? {
      ...service,
      options]), { label, description, price]
    } ));
  };

  const handleRemoveOption = (serviceId, optionIndex) => {
    setServices(prev => prev.map(service => service.id === serviceId ? {
      ...service,
      options]).filter((_, index) => index !== optionIndex)
    } ));
  };

  const handleUpdate = async (service) => {
    try {
      const parsedValues = service.values.map(Number);
      const serializedOptions = service.options?.map(option => ({ ...option, price) }));
      const updated = await updateService({ ...service, values, options);
      setServices(prev => prev.map(item => item.id === updated.id ? updated ));
      setMessage(`Serviço ${updated.title} atualizado com sucesso.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAddService = async () => {
    try {
      const created = await addService({
        title,
        description,
        rateLabel,
        unitLabel,
        basePrice),
        values,').map(value => Number(value.trim())),
        hourly)
      });
      setServices(prev => [...prev, created]);
      setMessage(`Serviço ${created.title} criado com sucesso.`);
      setNewService({ title, description, rateLabel, unitLabel, basePrice, values,0', hourly);
    } catch (error) {
      setMessage(error.message);
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
            <p style={{ textAlign, padding, opacity) : (
            <>
              <h3 style={{ marginTop, marginBottom, fontSize, textTransform, letterSpacing, color,255,255,0.9)' }}>📋 Serviços Configuráveis</h3>
              <div className="admin-grid">
              {services.filter(s => !['garcons','recepcionistas','djs','decoracao','salao'].includes(s.id)).map(service => {
                const isCollapsible = ['sonorizacao','iluminacao'].includes(service.id);
                const isCollapsed = Boolean(collapsed[service.id]);
                return (
                  <article key={service.id} className={`admin-card ${isCollapsible && isCollapsed ? 'collapsed' : ''}`}>
                    <div
                      className={`admin-card-title ${isCollapsible ? 'clickable' : ''}`}
                      onClick={() => {
                        if (!isCollapsible) return;
                        setCollapsed(prev => ({ ...prev, [service.id]] }));
                      }}
                      onKeyDown={(event) => {
                        if (!isCollapsible) return;
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setCollapsed(prev => ({ ...prev, [service.id]] }));
                        }
                      }}
                      role={isCollapsible ? 'button' : undefined}
                      tabIndex={isCollapsible ? 0 : -1}
                    >
                      <h3>{service.title}</h3>
                      {isCollapsible && <span className="admin-collapse-hint">Clique para expandir</span>}
                    </div>

                    {!(isCollapsible && isCollapsed) && (
                      <>
                        {!['sonorizacao','iluminacao'].includes(service.id) ? (
                          <>
                            <label>
                              Nome do serviço
                              <input
                                value={service.title}
                                onChange={e => handleChange(service.id, 'title', e.target.value)}
                              />
                            </label>
                            <label>
                              Descrição
                              <textarea
                                rows={3}
                                value={service.description}
                                onChange={e => handleChange(service.id, 'description', e.target.value)}
                              />
                            </label>
                          </>
                        ) : null}

                        {service.options?.length ? (
                          <div className="admin-options">
                            <h4>Pacotes / opções</h4>
                            {service.options.map((option, index) => (
                              <div key={`${service.id}-${index}`} className="admin-option-editor">
                                <label>
                                  Nome do pacote
                                  <input
                                    value={option.label}
                                    onChange={e => handleOptionChange(service.id, index, 'label', e.target.value)}
                                  />
                                </label>
                                <label>
                                  Descrição
                                  <textarea
                                    rows={2}
                                    value={option.description}
                                    onChange={e => handleOptionChange(service.id, index, 'description', e.target.value)}
                                  />
                                </label>
                                <label>
                                  Valor por hora
                                  <input
                                    type="number"
                                    value={option.price}
                                    onChange={e => handleOptionChange(service.id, index, 'price', e.target.value)}
                                  />
                                </label>
                                <button type="button" onClick={() => handleRemoveOption(service.id, index)}>Remover pacote</button>
                              </div>
                            ))}
                            <button type="button" onClick={() => handleAddOption(service.id)}>Adicionar pacote</button>
                          </div>
                        ) : null}
                        <button type="button" onClick={() => handleUpdate(service)}>Salvar</button>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
            </>
          )}

          <h3 style={{ marginTop, marginBottom, fontSize, textTransform, letterSpacing, color,255,255,0.9)' }}>💰 Orçamentos</h3>

          <article className="admin-card">
            <h3>📌 Orçamento em Edição</h3>
            {quoteExists && storedQuote ? (
              <>
                <div style={{ display, gridTemplateColumns, minmax(150px, 1fr))', gap, marginBottom, padding, background, 184, 77, 0.08)', borderRadius, border, 184, 77, 0.15)' }}>
                  <div>
                    <span style={{ fontSize, color,255,255,0.6)', textTransform, letterSpacing: '0.5px' }}>Cliente</span>
                    <p style={{ margin, fontSize, color, fontWeight: '600' }}>{storedQuote.clientName || '—'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize, color,255,255,0.6)', textTransform, letterSpacing: '0.5px' }}>Total</span>
                    <p style={{ margin, fontSize, color, fontWeight)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize, color,255,255,0.6)', textTransform, letterSpacing: '0.5px' }}>Itens</span>
                    <p style={{ margin, fontSize, color, fontWeight: '600' }}>{storedQuote.items.length} selecionado{storedQuote.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="admin-quote-items">
                  {storedQuote.items.map(item => {
                    const isExpanded = Boolean(expandedQuoteItems[item.id]);
                    return (
                      <div key={item.id} className={`admin-quote-item ${isExpanded ? 'expanded' : ''}`}>
                        <button
                          type="button"
                          className="admin-quote-item-toggle"
                          onClick={() => toggleQuoteItem(item.id)}
                        >
                          <span>{item.title}</span>
                          <span className="admin-quote-item-hint">{isExpanded ? 'Ocultar' : 'Ver'}</span>
                        </button>
                        {isExpanded && (
                          <div className="admin-quote-item-details">
                            <p>{item.info || 'Detalhes não informados.'}</p>
                            <strong>R$ {item.total.toFixed(2)}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button type="button" onClick={handleClearQuote} style={{ marginTop) : (
              <p style={{ textAlign, padding, opacity)}
          </article>

          <article className="admin-card">
            <h3>📊 Orçamentos Salvos no Banco</h3>
            <button type="button" onClick={fetchSavedQuotes} disabled={loadingSavedQuotes} style={{ justifySelf, marginBottom: '12px' }}>{loadingSavedQuotes ? '⏳ Atualizando...' : '🔄 Atualizar'}</button>
            {loadingSavedQuotes ? (
              <p style={{ textAlign, padding, opacity) : savedQuotes.length ? (
              <div className="admin-quote-items">
                {savedQuotes.map(q => (
                  <div key={q.id} className="admin-quote-item">
                    <button type="button" className="admin-quote-item-toggle" onClick={() => toggleQuoteDetails(q.id)}>
                      <div style={{ textAlign, flex: 1 }}>
                        <div style={{ fontWeight, color)'}</div>
                        <div style={{ fontSize, color,255,255,0.6)', marginTop) )} • {new Date(q.createdAt).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <span className="admin-quote-item-hint">{quoteDetailsOpen[q.id] ? '✕' ] && (
                      <div className="admin-quote-item-details">
                        <div style={{ display, gridTemplateColumns, minmax(120px, 1fr))', gap, marginBottom, padding, background,0,0,0.3)', borderRadius: '8px' }}>
                          <div>
                            <span style={{ fontSize, color,255,255,0.5)', textTransform: 'uppercase' }}>Cliente</span>
                            <p style={{ margin, fontSize, color: '#fff' }}>{q.clientName}</p>
                          </div>
                          <div>
                            <span style={{ fontSize, color,255,255,0.5)', textTransform: 'uppercase' }}>Email</span>
                            <p style={{ margin, fontSize, color: '#ffb84d' }}>{q.clientEmail}</p>
                          </div>
                          <div>
                            <span style={{ fontSize, color,255,255,0.5)', textTransform: 'uppercase' }}>Telefone</span>
                            <p style={{ margin, fontSize, color: '#fff' }}>{q.clientPhone || '—'}</p>
                          </div>
                          <div>
                            <span style={{ fontSize, color,255,255,0.5)', textTransform: 'uppercase' }}>Data</span>
                            <p style={{ margin, fontSize, color).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div style={{ borderTop, 184, 77, 0.2)', paddingTop: '12px' }}>
                          <h4 style={{ margin, fontSize, color,255,255,0.9)' }}>📦 Itens do Orçamento</h4>
                          {(q.quote?.items || []).map((item) => (
                            <div key={item.id} style={{ marginBottom, paddingBottom, borderBottom,255,255,0.05)' }}>
                              <div style={{ fontWeight, color, marginBottom: '4px' }}>{item.title}</div>
                              <div style={{ fontSize, color,255,255,0.7)', marginBottom: '4px' }}>{item.info}</div>
                              <div style={{ fontSize, color, fontWeight).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => handleDeleteQuote(q.id)} style={{ marginTop, background, #ff5a7a, #ffb84d)', width, justifyContent)}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign, padding, opacity)}
          </article>
        </section>
      </main>
    </div>
  );
};

export default Admin;
