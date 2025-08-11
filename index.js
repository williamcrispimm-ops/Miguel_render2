// Render 2 - Serviços auxiliares + keep-alive ping
const express = require('express');
const bodyParser = require('body-parser');
const { URL } = require('url');

const app = express();
app.use(bodyParser.json());

app.get('/health', (req,res)=>{
  res.json({ ok: true, service: 'render_2', port: process.env.PORT || 3001, time: new Date().toISOString() });
});

app.post('/analise-semanal', (req,res)=>{
  const { userId } = req.body || {};
  res.json({ userId, totalSemana: 0, sugestoes: ["Exemplo de sugestão"] });
});

// --------- KEEP-ALIVE PING ---------
function startKeepAlive() {
  const raw = process.env.PING_URL || (process.env.RENDER_EXTERNAL_URL ? `${process.env.RENDER_EXTERNAL_URL}/health` : '');
  if (!raw) return;
  let urlObj;
  try { urlObj = new URL(raw); } catch { return; }
  const isHttps = urlObj.protocol === 'https:';
  const client = isHttps ? require('https') : require('http');
  const ping = () => {
    const req = client.get(raw, res => { res.resume(); });
    req.on('error', () => {});
  };
  setInterval(ping, 14 * 60 * 1000);
  setTimeout(ping, 20000);
}
startKeepAlive();

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>console.log('Render_2 up on', PORT));
