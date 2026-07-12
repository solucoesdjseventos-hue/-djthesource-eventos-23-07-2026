type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const STORAGE_KEY = 'djTheSourceUsers';

function getUsers() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) as Array<{ name: string; email: string; password: string }> : [];
}

function saveUsers(users: Array<{ name: string; email: string; password: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export async function registerClient(payload: RegisterPayload) {
  const users = getUsers();
  if (users.find(user => user.email === payload.email)) {
    throw new Error('E-mail já cadastrado. Faça login ou use outro e-mail.');
  }
  users.push(payload);
  saveUsers(users);
  return { name: payload.name, email: payload.email };
}

export async function loginClient(payload: LoginPayload) {
  const users = getUsers();
  const user = users.find(user => user.email === payload.email && user.password === payload.password);
  if (!user) {
    throw new Error('E-mail ou senha incorretos.');
  }
  return { name: user.name, email: user.email };
}
