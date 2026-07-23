

const baseUrl = '/api/services';

export async function fetchServices()]> {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error('Falha ao buscar serviços');
  return response.json();
}

export async function fetchServiceById(id): Promise<ServiceConfig> {
  const response = await fetch(`${baseUrl}/${id}`);
  if (!response.ok) throw new Error('Serviço não encontrado');
  return response.json();
}

export async function updateService(service) {
  const response = await fetch(`${baseUrl}/edit`, {
    method,
    headers,
    body)
  });
  if (!response.ok) throw new Error('Falha ao atualizar serviço');
  return response.json();
}

export async function addService(service, 'id' | 'editable'>) {
  const response = await fetch(`${baseUrl}/add`, {
    method,
    headers,
    body)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error));
    throw new Error(errorData.error || 'Erro ao criar serviço');
  }
  return response.json();
}
