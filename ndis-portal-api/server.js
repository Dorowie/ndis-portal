const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all services
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services').all();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
app.get('/api/services/:id', (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service
app.post('/api/services', (req, res) => {
  try {
    const { name, category, description, accent, icon } = req.body;
    const result = db.prepare(`
      INSERT INTO services (name, category, description, accent, icon)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, category, description, accent, icon);
    
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service
app.put('/api/services/:id', (req, res) => {
  try {
    const { name, category, description, accent, icon } = req.body;
    db.prepare(`
      UPDATE services 
      SET name = ?, category = ?, description = ?, accent = ?, icon = ?
      WHERE id = ?
    `).run(name, category, description, accent, icon, req.params.id);
    
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service
app.delete('/api/services/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`NDIS Portal API running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET    /api/services`);
  console.log(`  GET    /api/services/:id`);
  console.log(`  POST   /api/services`);
  console.log(`  PUT    /api/services/:id`);
  console.log(`  DELETE /api/services/:id`);
});
