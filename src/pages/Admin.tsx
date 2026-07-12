import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { fetchServices } from '../api/serviceApi';
import type { ServiceConfig, ServiceOption } from '../data/services';
import { services as defaultServices } from '../data/services';
import './Admin.css';

type QuoteItem = {
  id: string;
  title: string;
  info: string;
  total: number;
};

type QuoteData = {
  items: QuoteItem[];
  total: number;
  salon: string;
  clientName: string;
};

const Admin = () => {
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [quoteExists, setQuoteExists] = useState(false);
  const [storedQuote, setStoredQuote] = useState<QuoteData | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [expandedQuoteItems, setExpandedQuoteItems] = useState<Record<string, boolean>>({});
  const [savedQuotes, setSavedQuotes] = useState<any[]>([]);
  const [loadingSavedQuotes, setLoadingSavedQuotes] = useState(false);
  const [quoteDetailsOpen, setQuoteDetailsOpen] = useState<Record<string, boolean>>({});
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    rateLabel: 'Valor por hora',
    unitLabel: 'horas',
    basePrice: 0,
    values: '0,0',
    hourly: true
  });

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices(defaultServices))
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
    } catch (err: any) {
      setMessage('Backend indisponível no GitHub Pages. Orçamentos salvos localmente não podem ser carregados.');
    } finally {
      setLoadingSavedQuotes(false);
    }
  };

  const toggleQuoteDetails = (id: string) => {
    setQuoteDetailsOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm('Confirma exclusão deste orçamento?')) return;
    setMessage('Backend indisponível no GitHub Pages. Exclusão de orçamentos remotos não é suportada.');
  };

  const toggleQuoteItem = (itemId: string) => {
    setExpandedQuoteItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleChange = (id: string, field: keyof ServiceConfig, value: any) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleOptionChange = (serviceId: string, optionIndex: number, field: 'label' | 'description' | 'price', value: string | number) => {
    setServices(prev => prev.map(service => {
      if (service.id !== serviceId || !service.options) {
        return service;
      }

      const updatedOption: ServiceOption = field === 'price'
        ? { ...service.options![optionIndex], price: Number(value) }
        : { ...service.options![optionIndex], [field]: String(value) };

      return {
        ...service,
        options: service.options.map((option, index) => index === optionIndex ? updatedOption : option)
      };
    }));
  };

  const handleAddOption = (serviceId: string) => {
    setServices(prev => prev.map(service => service.id === serviceId ? {
      ...service,
      options: [...(service.options || []), { label: 'Novo pacote', description: 'Descreva o pacote', price: 0 }]
    } : service));
  };

  const handleRemoveOption = (serviceId: string, optionIndex: number) => {
    setServices(prev => prev.map(service => service.id === serviceId ? {
      ...service,
      options: (service.options || []).filter((_, index) => index !== optionIndex)
    } : service));
  };

  const handleUpdate = (service: ServiceConfig) => {
    setServices(prev => prev.map(item => item.id === service.id ? service : item));
    setMessage(`Serviço ${service.title} atualizado localmente. Backend não disponível no GitHub Pages.`);
  };

  const handleAddService = () => {
    const created: ServiceConfig = {
      ...newService,
      id: `${newService.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      values: newService.values.split(',').map(value => Number(value.trim())),
      editable: true
    } as ServiceConfig;
    setServices(prev => [...prev, created]);
    setMessage(`Serviço ${created.title} adicionado localmente. Backend não disponível no GitHub Pages.`);
    setNewService({ title: '', description: '', rateLabel: 'Valor por hora', unitLabel: 'horas', basePrice: 0, values: '0,0', hourly: true });
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
            <p style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7 }}>Carregando serviços...</p>
          ) : (
            <>
              <h3 style={{ marginTop: '32px', marginBottom: '20px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.9)' }}>📋 Serviços Configuráveis</h3>
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
                        setCollapsed(prev => ({ ...prev, [service.id]: !prev[service.id] }));
                      }}
                      onKeyDown={(event) => {
                        if (!isCollapsible) return;
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setCollapsed(prev => ({ ...prev, [service.id]: !prev[service.id] }));
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

          <h3 style={{ marginTop: '40px', marginBottom: '20px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.9)' }}>💰 Orçamentos</h3>

          <article className="admin-card">
            <h3>📌 Orçamento em Edição</h3>
            {quoteExists && storedQuote ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px', padding: '16px', background: 'rgba(255, 184, 77, 0.08)', borderRadius: '12px', border: '1px solid rgba(255, 184, 77, 0.15)' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cliente</span>
                    <p style={{ margin: '6px 0 0', fontSize: '1rem', color: '#fff', fontWeight: '600' }}>{storedQuote.clientName || '—'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</span>
                    <p style={{ margin: '6px 0 0', fontSize: '1.2rem', color: '#ffb84d', fontWeight: '700' }}>R$ {storedQuote.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Itens</span>
                    <p style={{ margin: '6px 0 0', fontSize: '1rem', color: '#fff', fontWeight: '600' }}>{storedQuote.items.length} selecionado{storedQuote.items.length !== 1 ? 's' : ''}</p>
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
                <button type="button" onClick={handleClearQuote} style={{ marginTop: '16px' }}>🗑️ Excluir Orçamento</button>
              </>
            ) : (
              <p style={{ textAlign: 'center', padding: '24px 0', opacity: 0.6 }}>📭 Nenhum orçamento em edição no momento</p>
            )}
          </article>

          <article className="admin-card">
            <h3>📊 Orçamentos Salvos no Banco</h3>
            <button type="button" onClick={fetchSavedQuotes} disabled={loadingSavedQuotes} style={{ justifySelf: 'start', marginBottom: '12px' }}>{loadingSavedQuotes ? '⏳ Atualizando...' : '🔄 Atualizar'}</button>
            {loadingSavedQuotes ? (
              <p style={{ textAlign: 'center', padding: '24px 0', opacity: 0.6 }}>Carregando orçamentos...</p>
            ) : savedQuotes.length ? (
              <div className="admin-quote-items">
                {savedQuotes.map(q => (
                  <div key={q.id} className="admin-quote-item">
                    <button type="button" className="admin-quote-item-toggle" onClick={() => toggleQuoteDetails(q.id)}>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontWeight: '700', color: '#fff' }}>{q.clientName || '(Sem nome)'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>R$ {q.quote?.total?.toFixed ? q.quote.total.toFixed(2) : (q.quote?.total ?? '—')} • {new Date(q.createdAt).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <span className="admin-quote-item-hint">{quoteDetailsOpen[q.id] ? '✕' : '∨'}</span>
                    </button>
                    {quoteDetailsOpen[q.id] && (
                      <div className="admin-quote-item-details">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Cliente</span>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#fff' }}>{q.clientName}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Email</span>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#ffb84d' }}>{q.clientEmail}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Telefone</span>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#fff' }}>{q.clientPhone || '—'}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Data</span>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#fff' }}>{new Date(q.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255, 184, 77, 0.2)', paddingTop: '12px' }}>
                          <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>📦 Itens do Orçamento</h4>
                          {(q.quote?.items || []).map((item: any) => (
                            <div key={item.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{item.title}</div>
                              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>{item.info}</div>
                              <div style={{ fontSize: '1rem', color: '#ffb84d', fontWeight: '700' }}>R$ {Number(item.total).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => handleDeleteQuote(q.id)} style={{ marginTop: '12px', background: 'linear-gradient(90deg, #ff5a7a, #ffb84d)', width: '100%', justifyContent: 'center' }}>🗑️ Excluir Orçamento</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '24px 0', opacity: 0.6 }}>📭 Nenhum orçamento salvo no banco de dados</p>
            )}
          </article>
        </section>
      </main>
    </div>
  );
};

export default Admin;
