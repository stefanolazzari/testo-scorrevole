const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const TEXT_FILE = path.join(__dirname, 'testo.txt');

function loadText() {
  try {
    // Rimuove gli a capo e spazi doppi, così il testo resta su una riga
    return fs.readFileSync(TEXT_FILE, 'utf8').replace(/\s+/g, ' ').trim() + '   ';
  } catch (err) {
    console.error('Impossibile leggere testo.txt:', err.message);
    return 'Testo non trovato   ';
  }
}

let TEXT = loadText();
const START_TIME = Date.now(); // riferimento temporale comune per l'animazione

// --- Server HTTP statico (serve public/index.html) ---
const server = http.createServer((req, res) => {
  const file = path.join(__dirname, 'public', 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); return res.end('Errore'); }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
});

// --- WebSocket ---
const wss = new WebSocketServer({ server });
const clients = []; // ordine di connessione = numero del client

function broadcastState() {
  clients.forEach((ws, i) => {
    ws.send(JSON.stringify({
      type: 'state',
      index: i + 1,          // numero di questo client (1-based)
      total: clients.length, // totale client connessi
      text: TEXT,
      startTime: START_TIME
    }));
  });
}

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log(`Client connesso. Totale: ${clients.length}`);
  broadcastState();

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      // Sincronizzazione orologio: il client manda t0, il server risponde con la sua ora
      if (data.type === 'sync') {
        ws.send(JSON.stringify({ type: 'sync', t0: data.t0, serverTime: Date.now() }));
      }
    } catch (e) { /* ignora messaggi non validi */ }
  });

  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1);
    console.log(`Client disconnesso. Totale: ${clients.length}`);
    broadcastState(); // rinumera i client rimasti
  });
});

server.listen(PORT, () => console.log(`Apri http://localhost:${PORT}`));
