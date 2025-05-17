import { WebSocketServer } from 'ws';
import process from 'node:process';

const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
	ws.on('message', (data) => {
		wss.clients.forEach((client) => {
			if (client.readyState === 1) client.send(data);
		});
	});
	ws.send(
		JSON.stringify({ from: 'server', text: 'Conexión WebSocket establecida' })
	);
});

wss.on('listening', () =>
	console.log(`WebSocket server escuchando en ws://localhost:${PORT}`)
);

wss.on('error', (err) => {
	if (err.code === 'EADDRINUSE')
		console.error(
			`⚠️  Puerto ${PORT} ocupado. Cambia WS_PORT o libera el puerto.`
		);
	else console.error(err);
});
