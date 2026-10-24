import { env } from '$env/dynamic/public';

export async function load({ fetch, cookies }) {
    // 1. Token auslesen (prüft 'jwt_token' oder 'session')
    const token = cookies.get('jwt_token');
    console.log('[DEBUG] Token vorhanden:', Boolean(token));

    // 2. URL mit Fallback auf Port 8080
    const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';
    const targetUrl = `${baseUrl}/api/workout`;
    console.log('[DEBUG] Rufe Ziel-URL auf:', targetUrl);

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('[DEBUG] Backend HTTP-Status:', response.status);

        if (response.ok) {
            const workouts = await response.json();
            return { workouts };
        }
    } catch (error) {
        console.error('[DEBUG] Fetch-Fehler:', error);
    }

    return { workouts: [] };
}

export const actions = {
    default: async ({ request, fetch, cookies }) => {
        const token = cookies.get('jwt_token');
        const data = await request.formData();
        
        // Formular-Felder auslesen...
        const response = await fetch(`${env.PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/workout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                // Workout-Objekt...
            })
        });

        return { success: response.ok };
    }
};