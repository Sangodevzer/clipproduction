const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

// Charger les variables d'environnement en développement
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    console.log('dotenv not available, using environment variables');
  }
}

const app = express();
const port = process.env.PORT || 3000;
const APP_PASSWORD = process.env.APP_PASSWORD || 'clipbeles';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '500mb' })); // Augmenter la limite pour les images base64
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Initialize database
const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        time TEXT,
        map_url TEXT,
        category TEXT DEFAULT 'other',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS needs (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS budget_expenses (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS scouting_photos (
        id TEXT PRIMARY KEY,
        image_data TEXT NOT NULL,
        location TEXT,
        description TEXT,
        scene_number TEXT,
        category TEXT DEFAULT 'Autres',
        media_type TEXT DEFAULT 'image',
        upload_date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Migration: Ajouter toutes les colonnes manquantes
    await client.query(`
      DO $$ 
      BEGIN
        -- Ajouter category si manquante
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='scouting_photos' AND column_name='category'
        ) THEN
          ALTER TABLE scouting_photos ADD COLUMN category TEXT DEFAULT 'Autres';
        END IF;
        
        -- Ajouter media_type si manquante
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='scouting_photos' AND column_name='media_type'
        ) THEN
          ALTER TABLE scouting_photos ADD COLUMN media_type TEXT DEFAULT 'image';
        END IF;
        
        -- Ajouter scene_number si manquante
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='scouting_photos' AND column_name='scene_number'
        ) THEN
          ALTER TABLE scouting_photos ADD COLUMN scene_number TEXT;
        END IF;
        
        -- Ajouter display_order si manquante
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='scouting_photos' AND column_name='display_order'
        ) THEN
          ALTER TABLE scouting_photos ADD COLUMN display_order INTEGER DEFAULT 0;
        END IF;
      END $$;
    `);
    
    console.log('Database initialized and migrated');
  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    client.release();
  }
};

initDB();

// API Routes

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === APP_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

// Cards
app.get('/api/cards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cards ORDER BY date, time');
    const cards = result.rows.map(row => ({
      id: row.id,
      date: row.date,
      title: row.title,
      description: row.description,
      time: row.time,
      mapUrl: row.map_url,
      category: row.category
    }));
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/cards', async (req, res) => {
  const { id, date, title, description, time, mapUrl, category } = req.body;
  try {
    await pool.query(
      'INSERT INTO cards (id, date, title, description, time, map_url, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, date, title, description, time, mapUrl, category]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { date, title, description, time, mapUrl, category } = req.body;
  try {
    await pool.query(
      'UPDATE cards SET date = $1, title = $2, description = $3, time = $4, map_url = $5, category = $6, updated_at = NOW() WHERE id = $7',
      [date, title, description, time, mapUrl, category, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cards WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Needs
app.get('/api/needs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM needs ORDER BY created_at');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/needs', async (req, res) => {
  const { id, text } = req.body;
  try {
    await pool.query('INSERT INTO needs (id, text) VALUES ($1, $2)', [id, text]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/needs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM needs WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { id, text, completed } = req.body;
  try {
    await pool.query('INSERT INTO todos (id, text, completed) VALUES ($1, $2, $3)', [id, text, completed]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  try {
    await pool.query('UPDATE todos SET text = $1, completed = $2 WHERE id = $3', [text, completed, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Settings (pour start_date et num_days)
app.get('/api/settings/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const result = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
    if (result.rows.length > 0) {
      res.json({ value: result.rows[0].value });
    } else {
      res.json({ value: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/settings/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  try {
    await pool.query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
      [key, value]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Budget Expenses
app.get('/api/budget/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM budget_expenses ORDER BY date DESC, created_at DESC');
    const expenses = result.rows.map(row => ({
      id: row.id,
      category: row.category,
      description: row.description,
      amount: parseFloat(row.amount),
      date: row.date
    }));
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/budget/expenses', async (req, res) => {
  const { id, category, description, amount, date } = req.body;
  try {
    await pool.query(
      'INSERT INTO budget_expenses (id, category, description, amount, date) VALUES ($1, $2, $3, $4, $5)',
      [id, category, description, amount, date]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/budget/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { category, description, amount, date } = req.body;
  try {
    await pool.query(
      'UPDATE budget_expenses SET category = $1, description = $2, amount = $3, date = $4 WHERE id = $5',
      [category, description, amount, date, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/budget/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM budget_expenses WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Scouting Photos
app.get('/api/scouting/photos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scouting_photos ORDER BY display_order ASC, upload_date DESC, created_at DESC');
    const photos = result.rows.map(row => ({
      id: row.id,
      imageData: row.image_data,
      location: row.location,
      description: row.description,
      sceneNumber: row.scene_number,
      category: row.category,
      mediaType: row.media_type,
      uploadDate: row.upload_date,
      displayOrder: row.display_order || 0
    }));
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/scouting/photos', async (req, res) => {
  const { id, imageData, location, description, sceneNumber, category, mediaType, uploadDate } = req.body;
  console.log('📸 Reçu photo upload:', { id, mediaType, category, imageDataLength: imageData?.length || 0 });
  try {
    await pool.query(
      'INSERT INTO scouting_photos (id, image_data, location, description, scene_number, category, media_type, upload_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, imageData, location, description, sceneNumber, category || 'Autres', mediaType || 'image', uploadDate]
    );
    console.log('✅ Photo sauvegardée avec succès:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur sauvegarde photo:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.put('/api/scouting/photos/:id', async (req, res) => {
  const { id } = req.params;
  const { imageData, location, description, sceneNumber, category, mediaType, uploadDate } = req.body;
  try {
    await pool.query(
      'UPDATE scouting_photos SET image_data = $1, location = $2, description = $3, scene_number = $4, category = $5, media_type = $6, upload_date = $7 WHERE id = $8',
      [imageData, location, description, sceneNumber, category || 'Autres', mediaType || 'image', uploadDate, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/scouting/photos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM scouting_photos WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reorder scouting photos
app.post('/api/scouting/photos/reorder', async (req, res) => {
  const { photoIds } = req.body;
  try {
    // Mettre à jour l'ordre de chaque photo
    const promises = photoIds.map((id, index) => 
      pool.query('UPDATE scouting_photos SET display_order = $1 WHERE id = $2', [index, id])
    );
    await Promise.all(promises);
    res.json({ success: true });
  } catch (err) {
    console.error('Error reordering photos:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
