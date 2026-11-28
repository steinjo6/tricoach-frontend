import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const API_BASE_URL = env.API_BASE_URL || 'http://localhost:8080';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, fetch }) {
	const token = cookies.get('jwt_token');
	if (!token) {
		throw error(401, 'Nicht authentifiziert. Bitte zuerst über Auth0 einloggen.');
	}

	const { message } = await request.json();
	if (!message || !message.trim()) {
		throw error(400, 'Die Nachricht darf nicht leer sein.');
	}

	const backendResponse = await fetch(`${API_BASE_URL}/api/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ message })
	});

	if (!backendResponse.ok) {
		const errorText = await backendResponse.text();
		throw error(
			backendResponse.status,
			errorText || `Backend-Fehler (${backendResponse.status})`
		);
	}

	const rawText = await backendResponse.text();
	let reply = rawText;

	try {
		const parsed = JSON.parse(rawText);
		reply = parsed.reply ?? parsed.response ?? parsed.message ?? parsed.content ?? rawText;
	} catch {
		// Fallback, falls /api/chat direkt einen reinen String zurückgibt
	}

	return json({ reply });
}