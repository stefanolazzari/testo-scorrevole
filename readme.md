# Testo scorrevole distribuito

Applicazione web che mostra un testo in scorrimento continuo, suddiviso tra più client collegati allo stesso server. Ogni client mostra una porzione dello stage virtuale e la posizione del testo è sincronizzata tramite WebSocket.

## Requisiti

- Node.js
- npm

## Avvio

Dalla cartella del progetto, installa le dipendenze e avvia il server:

```bash
npm install
npm start
```

Il server usa la porta `3000` per impostazione predefinita. Per sceglierne un'altra, imposta la variabile d'ambiente `PORT` prima dell'avvio.

Apri `http://localhost:3000` nel browser. Per distribuire il testo su più schermi, apri lo stesso indirizzo su ciascun dispositivo collegato al server. Se il server è su un altro computer, sostituisci `localhost` con il suo indirizzo di rete. Il server e la rete devono consentire le connessioni WebSocket.

## Modificare il testo

Modifica `testo.txt` nella cartella principale. Il server legge il file all'avvio, unisce gli spazi e gli a capo in un'unica riga e distribuisce il testo ai client. Riavvia il server dopo aver modificato il file.

## Configurazione

- `PORT`: porta HTTP e WebSocket del server; il valore predefinito è `3000`.