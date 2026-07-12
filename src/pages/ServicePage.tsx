import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ServiceConfig, services as defaultServices } from '../data/services';
import './ServicePage.css';

const guestLabels = [100, 200, 300, 400];

const ServicePage = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<ServiceConfig | undefined>();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(guestLabels[0]);
  const [priceIndex, setPriceIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [hours, setHours] = useState(1);
  const [eventTheme, setEventTheme] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    fetch(`/api/services/${serviceId}`)
      .then(response => {
        if (!response.ok) throw new Error('Serviço não encontrado');
        return response.json();
      })
      .then(data => {
        setService(data);
        setQuantity(data.hourly ? 1 : guestLabels[0]);
        setPriceIndex(0);
        setSelectedOptionIndex(0);
        setHours(1);
      })
      .catch(() => {
        const localService = defaultServices.find(item => item.id === serviceId);
        setService(localService);
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  useEffect(() => {
    if (service) {
      setQuantity(service.hourly ? 1 : guestLabels[0]);
      setPriceIndex(0);
      setSelectedOptionIndex(0);
      setHours(1);
    }
  }, [service]);

  if (loading) return <div>Carregando serviço...</div>;
  if (!service) return <div>Serviço não encontrado.</div>;

  const selectedOption = service.options?.[selectedOptionIndex];
  const selectedPrice = service.hourly && selectedOption ? selectedOption.price : service.values[priceIndex];
  const total = service.hourly ? selectedPrice * hours : selectedPrice;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const stored = localStorage.getItem('djQuote');
    const current = stored ? JSON.parse(stored) : { items: [], total: 0, salon: '', clientName: '', theme: '', address: '', eventStart: '', eventEnd: '' };
    const item = {
      id: service.id,
      title: service.title,
      info: service.hourly
        ? `${hours} ${service.unitLabel}${selectedOption ? ` • ${selectedOption.label}` : ''}`
        : `${quantity} convidados`,
      total
    };

    const next = {
      ...current,
      items: [...current.items.filter((entry: any) => entry.id !== service.id), item],
      total: Number((current.total - (current.items.find((entry: any) => entry.id === service.id)?.total || 0) + total).toFixed(2)),
      salon: service.id === 'salao' ? `${quantity} convidados` : current.salon,
      theme: service.id === 'salao' ? eventTheme : current.theme,
      address: service.id === 'salao' ? eventAddress : current.address,
      eventStart: service.id === 'salao' ? eventStart : current.eventStart,
      eventEnd: service.id === 'salao' ? eventEnd : current.eventEnd
    };
    localStorage.setItem('djQuote', JSON.stringify(next));
    navigate('/orcamento');
  };

  return (
    <div className="page-shell">
      <Header />
      <main className="service-page">
        <section className="service-details">
          <div className="service-content">
            <div className="service-title">
              <h2>{service.title}</h2>
            </div>
            <p>{service.description}</p>
            <form onSubmit={handleSubmit} className="service-form">
            {service.hourly ? (
              <>
                <label>
                  Horas:
                  <input
                    type="number"
                    min={1}
                    value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                  />
                </label>
                {service.options?.length ? (
                  <>
                    <label>
                      Equipamento / pacote:
                      <select value={selectedOptionIndex} onChange={e => setSelectedOptionIndex(Number(e.target.value))}>
                        {service.options.map((option, index) => (
                          <option key={option.label} value={index}>
                            {option.label} — R$ {option.price.toFixed(2)}/h
                          </option>
                        ))}
                      </select>
                    </label>
                    {selectedOption && (
                      <p className="service-option-description">{selectedOption.description}</p>
                    )}
                  </>
                ) : (
                  <label>
                    Valor por hora:
                    <select value={priceIndex} onChange={e => setPriceIndex(Number(e.target.value))}>
                      {service.values.map((value, index) => (
                        <option key={value} value={index}>
                          R$ {value.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </>
            ) : (
              <label>
                Número de convidados:
                <select value={priceIndex} onChange={e => { setPriceIndex(Number(e.target.value)); setQuantity(guestLabels[Number(e.target.value)]); }}>
                  {guestLabels.map((label, index) => (
                    <option key={label} value={index}>R$ {service.values[index].toFixed(2)} — {label} convidados</option>
                  ))}
                </select>
              </label>
            )}
            {service.id === 'salao' && (
              <div className="salon-fields">
                <label>
                  Tema do evento
                  <input
                    type="text"
                    value={eventTheme}
                    onChange={e => setEventTheme(e.target.value)}
                    placeholder="Ex: Casamento, Aniversário"
                  />
                </label>
                <label>
                  Endereço do evento
                  <input
                    type="text"
                    value={eventAddress}
                    onChange={e => setEventAddress(e.target.value)}
                    placeholder="Rua, número, bairro"
                  />
                </label>
                <label>
                  Horário de início
                  <input
                    type="time"
                    value={eventStart}
                    onChange={e => setEventStart(e.target.value)}
                  />
                </label>
                <label>
                  Horário de fim
                  <input
                    type="time"
                    value={eventEnd}
                    onChange={e => setEventEnd(e.target.value)}
                  />
                </label>
              </div>
            )}
            <p className="service-total">Total: R$ {total.toFixed(2)}</p>
            <button type="submit">Adicionar ao orçamento</button>
          </form>
          </div>
          {service.id === 'sonorizacao' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src={`${baseUrl}audio-equipment.png`}
                  alt="Equipamento de sonorização"
                  className="service-title-image"
                />
              </div>
            </div>
          )}
          {service.id === 'iluminacao' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src={`${baseUrl}sonorizacao-equipment.png`}
                  alt="Equipamento de iluminação"
                  className="service-title-image"
                />
              </div>
            </div>
          )}
          {service.id === 'garcons' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src={`${baseUrl}garcons.jpg`}
                  alt="Garçons profissionais"
                  className="service-title-image"
                />
              </div>
            </div>
          )}
          {service.id === 'djs' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src={`${baseUrl}djs.jpg`}
                  alt="DJ profissional"
                  className="service-title-image"
                />
              </div>
            </div>
          )}
          {service.id === 'decoracao' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src={`${baseUrl}decorador.jpg`}
                  alt="Decorador profissional"
                  className="service-title-image"
                />
              </div>
            </div>
          )}
          {service.id === 'salao' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src={`${baseUrl}salaoeventos.jpg`}
                  alt="Salão de eventos"
                  className="service-title-image"
                />
              </div>
            </div>
          )}
          {service.id === 'recepcionistas' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src={`${baseUrl}recepcionista.jpg`}
                  alt="Recepcionistas profissionais"
                  className="service-title-image"
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ServicePage;
