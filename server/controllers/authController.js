const crypto = require('crypto');
const { addClient, getClientByEmail } = require('../utils/db');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const existing = await getClientByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Já existe um cliente cadastrado com este e-mail.' });
    }

    const client = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      email,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    const created = await addClient(client);
    return res.status(201).json({ id: created.id, name: created.name, email: created.email });
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
    return res.status(500).json({ error: 'Erro interno ao cadastrar cliente.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const client = await getClientByEmail(email);
    if (!client) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const expectedHash = hashPassword(password);
    if (client.password !== expectedHash) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    return res.json({ id: client.id, name: client.name, email: client.email });
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    return res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
};

module.exports = { register, login };
