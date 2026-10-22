const http = require('http');
// Simulando banco de dados em memória
const pacientes = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@email.com', nascimento: '1990-04-12' },
  { id: 2, nome: 'João Pereira', email: 'joao.pereira@email.com', nascimento: '1985-11-30' },
  { id: 3, nome: 'Ana Costa', email: 'ana.costa@email.com', nascimento: '2001-07-08' },
];

const servidor = http.createServer((req, res) => {
  // 1. Configuração de Cabeçalhos (Headers) e Liberação de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // 2. Rota: GET /pacientes
  if (req.method === 'GET' && req.url === '/pacientes') {
    console.log("Dentro da rota pacientes");
    res.writeHead(200);
    res.end(JSON.stringify(pacientes));
    return;
  }

  // 3. Rota Não Encontrada (404)
  res.writeHead(404);
  res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
});

const express = require('express');
const cors = require('cors');


const app = express();

// READ (um) — GET /pacientes/:id
app.get('/pacientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const paciente = pacientes.find((p) => p.id === id);

  if (!paciente) {
    return res.status(404).json({ erro: 'Paciente não encontrado' });
  }

  res.json(paciente);
});


const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

