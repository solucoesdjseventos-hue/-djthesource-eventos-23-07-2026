const { readServices, saveServices } = require("../utils/serviceStore");

const getServices = (req, res) => {
  const services = readServices();
  return res.json(services);
};

const getServiceById = (req, res) => {
  const services = readServices();
  const service = services.find((item) => item.id === req.params.id);

  if (!service) {
    return res.status(404).json({ error: "Serviço não encontrado" });
  }

  return res.json(service);
};

const editService = (req, res) => {
  const {
    id,
    title,
    description,
    rateLabel,
    unitLabel,
    basePrice,
    values,
    hourly,
    options,
  } = req.body;
  const services = readServices();
  const index = services.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Serviço não encontrado" });
  }

  services[index] = {
    ...services[index],
    title: title || services[index].title,
    description: description || services[index].description,
    rateLabel: rateLabel || services[index].rateLabel,
    unitLabel: unitLabel || services[index].unitLabel,
    basePrice:
      typeof basePrice === "number" ? basePrice : services[index].basePrice,
    values: Array.isArray(values) ? values : services[index].values,
    hourly: typeof hourly === "boolean" ? hourly : services[index].hourly,
    options: Array.isArray(options) ? options : services[index].options,
    editable: true,
  };

  saveServices(services);
  return res.json(services[index]);
};

const addService = (req, res) => {
  const {
    title,
    description,
    rateLabel,
    unitLabel,
    basePrice,
    values,
    hourly,
    options,
  } = req.body;
  if (
    !title ||
    !description ||
    !rateLabel ||
    !unitLabel ||
    typeof basePrice !== "number" ||
    !Array.isArray(values)
  ) {
    return res
      .status(400)
      .json({ error: "Dados incompletos para criar novo serviço" });
  }

  const services = readServices();
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (services.some((item) => item.id === id)) {
    return res
      .status(400)
      .json({ error: "Já existe um serviço com esse nome" });
  }

  const newService = {
    id,
    title,
    description,
    rateLabel,
    unitLabel,
    basePrice,
    values,
    editable: true,
    hourly: Boolean(hourly),
    options: Array.isArray(options) ? options : undefined,
  };

  services.push(newService);
  saveServices(services);
  return res.status(201).json(newService);
};

module.exports = { getServices, getServiceById, editService, addService };
