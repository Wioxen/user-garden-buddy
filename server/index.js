require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Pool de conexões MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
});

// Criar tabela automaticamente se não existir
async function initDatabase() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela "usuarios" verificada/criada com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error.message);
    process.exit(1);
  }
}

// POST /api/usuarios - Cadastrar usuário
app.post('/api/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios (nome, email, senha).' });
  }

  if (nome.length > 150) {
    return res.status(400).json({ error: 'Nome deve ter no máximo 150 caracteres.' });
  }

  if (email.length > 150) {
    return res.status(400).json({ error: 'Email deve ter no máximo 150 caracteres.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres.' });
  }

  try {
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.execute(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome.trim(), email.trim().toLowerCase(), senhaHash]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }
    console.error('Erro ao cadastrar:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /api/usuarios - Listar usuários
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nome, email, data_criacao FROM usuarios ORDER BY data_criacao DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

const PORT = process.env.SERVER_PORT || 3001;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
});
