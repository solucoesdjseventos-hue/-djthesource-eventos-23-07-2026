const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const quoteRoutes = require('./routes/quoteRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api', quoteRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DJ The Source API' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`DJ The Source backend is running on http://localhost:${port}`);
});
