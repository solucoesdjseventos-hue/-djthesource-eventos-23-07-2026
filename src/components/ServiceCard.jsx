import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service }) => (
  <article className="service-card">
    <h3>{service.title}</h3>
    <p>{service.description}</p>
    <p className="service-price">A partir de R$ {service.values[0].toFixed(2)}</p>
    <Link to={`/servico/${service.id}`} className="service-link">Ver detalhes</Link>
  </article>
);

export default ServiceCard;
