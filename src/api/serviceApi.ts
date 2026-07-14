import type { ServiceConfig } from "../data/services";

const baseUrl = "/api/services";

export async function fetchServices(): Promise<ServiceConfig[]> {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Falha ao buscar serviços");
  }
  return response.json();
}

export async function fetchServiceById(id: string): Promise<ServiceConfig> {
  const response = await fetch(`${baseUrl}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Serviço não encontrado");
  }
  return response.json();
}

export async function updateService(
  service: Partial<ServiceConfig> & { id: string },
) {
  const response = await fetch(`${baseUrl}/edit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Falha ao atualizar serviço");
  }
  return response.json();
}

export async function addService(
  service: Omit<ServiceConfig, "id" | "editable">,
) {
  const response = await fetch(`${baseUrl}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(service),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Falha ao criar serviço");
  }
  return response.json();
}
