import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ServiceConfig } from '../data/services';
import './ServicePage.css';

const guestLabels = [100, 200, 300, 400];

const ServicePage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState();
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
        setQuantity(data.hourly ? 1 ]);
        setPriceIndex(0);
        setSelectedOptionIndex(0);
        setHours(1);
      })
      .catch(() => setService(undefined))
      .finally(() => setLoading(false));
  }, [serviceId]);

  useEffect(() => {
    if (service) {
      setQuantity(service.hourly ? 1 ]);
      setPriceIndex(0);
      setSelectedOptionIndex(0);
      setHours(1);
    }
  }, [service]);

  if (loading) return <div>Carregando serviço...</div>;
  if (!service) return <div>Serviço não encontrado.</div>;

  const selectedOption = service.options?.[selectedOptionIndex];
  const selectedPrice = service.hourly && selectedOption ? selectedOption.price ];
  const total = service.hourly ? selectedPrice * hours ;

  const handleSubmit = (event) => {
    event.preventDefault();
    const stored = localStorage.getItem('djQuote');
    const current = stored ? JSON.parse(stored) ], total, salon, clientName, theme, address, eventStart, eventEnd;
    const item = {
      id,
      title,
      info,
      total
    };

    const next = {
      ...current,
      items) => entry.id !== service.id), item],
      total) => entry.id === service.id)?.total || 0) + total).toFixed(2)),
      salon: service.id === 'salao' ? `${quantity} convidados` ,
      theme: service.id === 'salao' ? eventTheme ,
      address: service.id === 'salao' ? eventAddress ,
      eventStart: service.id === 'salao' ? eventStart ,
      eventEnd: service.id === 'salao' ? eventEnd ;
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
                    placeholder="Ex, Aniversário"
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
            <p className="service-total">Total)}</p>
            <button type="submit">Adicionar ao orçamento</button>
          </form>
          </div>
          {service.id === 'sonorizacao' && (
            <div className="service-image-container">
              <div className="image-frame">
                <img
                  src="/audio-equipment.png"
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
                  src="/sonorizacao-equipment.png"
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
                  src="/garcons.jpg"
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
                  src="/djs.jpg"
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
                  src="/decorador.jpg"
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
                  src="/salaoeventos.jpg"
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
                  src="/recepcionista.jpg"
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
