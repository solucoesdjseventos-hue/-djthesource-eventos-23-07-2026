



const baseUrl = '/api/auth';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Falha na comunicação com o servidor');
  }
  return data;
}

export async function registerClient(payload) {
  const response = await fetch(`${baseUrl}/register`, {
    method,
    headers,
    body)
  });
  return handleResponse(response);
}

export async function loginClient(payload) {
  const response = await fetch(`${baseUrl}/login`, {
    method,
    headers,
    body)
  });
  return handleResponse(response);
}
