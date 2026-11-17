import { env } from '$env/dynamic/public';

export async function load({ url, fetch, cookies }) {
	const token = cookies.get('jwt_token');

	// URL-Parameter für Pagination auslesen (Defaults: Seite 1, 4 Einträge)
	const currentPage = parseInt(url.searchParams.get('pageNumber') || '1');
	const pageSize = parseInt(url.searchParams.get('pageSize') || '4');

	const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';
	const targetUrl = `${baseUrl}/api/workout?pageSize=${pageSize}&pageNumber=${currentPage}`;

	try {
		const response = await fetch(targetUrl, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			return {
				workouts: data.content || [],
				nrOfPages: data.totalPages || 0,
				currentPage: currentPage
			};
		}
	} catch (error) {
		console.error('[DEBUG] Fetch-Fehler:', error);
	}

	return {
		workouts: [],
		nrOfPages: 0,
		currentPage: 1
	};
}

export const actions = {
    default: async ({ request, fetch, cookies }) => {
        const token = cookies.get('jwt_token');
        const formData = await request.formData();

        // 1. Felder aus dem Formular auslesen und säubern
        const athleteId = formData.get('athleteId')?.toString().trim();
        const sportType = formData.get('sportType')?.toString();
        const distanceKm = parseFloat(formData.get('distanceKm')?.toString() || '0');

        // 2. Vollständiges DTO mit Standardwerten für die restlichen Backend-Felder bauen
        const workoutPayload = {
            athleteId: athleteId,
            sportType: sportType,
            distanceKm: distanceKm,
            title: `${sportType} Training`,
            description: 'Erfasst via TriCoach Frontend',
            durationMinutes: 45
        };

        const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';

        try {
            const response = await fetch(`${baseUrl}/api/workout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(workoutPayload)
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorText = await response.text();
                return { 
                    success: false, 
                    message: `Fehler ${response.status}: ${errorText || 'Athlet nicht gefunden oder keine Admin-Berechtigung.'}` 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: 'Verbindung zum Backend fehlgeschlagen.' 
            };
        }
    }
};