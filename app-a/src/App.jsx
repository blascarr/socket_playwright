import { useEffect, useRef, useState } from 'react';

export default function App() {
	const [messages, setMessages] = useState([]);
	const wsRef = useRef(null);

	useEffect(() => {
		const ws = new WebSocket(
			import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
		);
		wsRef.current = ws;
		ws.addEventListener('message', (e) =>
			setMessages((p) => [...p, JSON.parse(e.data)])
		);
		return () => ws.close();
	}, []);

	const sendPing = () => {
		const payload = {
			from: 'app-a',
			text: 'PING desde A',
			timestamp: Date.now(),
		};
		wsRef.current?.send(JSON.stringify(payload));
		setMessages((p) => [...p, payload]);
	};

	return (
		<main className='p-4 space-y-4'>
			<h1 className='text-2xl font-bold'>App A</h1>
			<button
				className='px-4 py-2 bg-blue-600 text-white rounded'
				onClick={sendPing}
			>
				Enviar PING
			</button>
			<ul className='divide-y'>
				{messages.map((m, i) => (
					<li key={i} className='py-1 text-sm'>
						<b>{m.from}</b>: {m.text} (
						{new Date(m.timestamp ?? Date.now()).toLocaleTimeString()})
					</li>
				))}
			</ul>
		</main>
	);
}
