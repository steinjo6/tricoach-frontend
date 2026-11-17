import { env } from '$env/dynamic/public';

export async function load({ url, fetch, cookies }) {
	const token = cookies.get('jwt_token');
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
	createWorkout: async ({ request, fetch, cookies }) => {
		const token = cookies.get('jwt_token');
		const formData = await request.formData();

		const athleteId = formData.get('athleteId')?.toString().trim();
		const sportType = formData.get('sportType')?.toString();
		const distanceKm = parseFloat(formData.get('distanceKm')?.toString() || '0');

		const workoutPayload = {
			athleteId,
			sportType,
			distanceKm,
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
			}
			return { success: false, message: `Fehler beim Erstellen (${response.status})` };
		} catch (error) {
			return { success: false, message: 'Backend nicht erreichbar.' };
		}
	},

	assignToMe: async ({ request, fetch, cookies }) => {
		const token = cookies.get('jwt_token');
		const formData = await request.formData();
		const workoutId = formData.get('workoutId')?.toString();
		const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';

		try {
			const response = await fetch(`${baseUrl}/api/service/me/assignworkout`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ workoutId })
			});

			if (!response.ok) {
				return { success: false, message: `Zuweisung fehlgeschlagen (${response.status})` };
			}
			return { success: true };
		} catch (error) {
			return { success: false, message: 'Backend nicht erreichbar.' };
		}
	},

	completeMyWorkout: async ({ request, fetch, cookies }) => {
		const token = cookies.get('jwt_token');
		const formData = await request.formData();
		const workoutId = formData.get('workoutId')?.toString();
		const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';

		try {
			const response = await fetch(`${baseUrl}/api/service/me/completeworkout`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ workoutId })
			});

			if (!response.ok) {
				return { success: false, message: `Abschliessen fehlgeschlagen (${response.status})` };
			}
			return { success: true };
		} catch (error) {
			return { success: false, message: 'Backend nicht erreichbar.' };
		}
	}
};