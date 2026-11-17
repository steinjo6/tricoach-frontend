import { env } from '$env/dynamic/public';

export async function load({ url, fetch, cookies }) {
	const token = cookies.get('jwt_token');
	const currentPage = parseInt(url.searchParams.get('pageNumber') || '1');
	const pageSize = parseInt(url.searchParams.get('pageSize') || '4');

	const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';
	const targetUrl = `${baseUrl}/api/athlete?pageSize=${pageSize}&pageNumber=${currentPage}`;

	try {
		const response = await fetch(targetUrl, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			return {
				athletes: data.content || [],
				nrOfPages: data.totalPages || 0,
				currentPage: currentPage
			};
		}
	} catch (error) {
		console.error('[DEBUG] Fetch-Fehler Athletes:', error);
	}

	return {
		athletes: [],
		nrOfPages: 0,
		currentPage: 1
	};
}

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		const token = cookies.get('jwt_token');
		const formData = await request.formData();

		const athletePayload = {
			name: formData.get('name')?.toString().trim(),
			email: formData.get('email')?.toString().trim()
		};

		const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';

		try {
			const response = await fetch(`${baseUrl}/api/athlete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(athletePayload)
			});

			if (response.ok) {
				return { success: true };
			}
			return { success: false, message: `Fehler beim Erstellen (${response.status})` };
		} catch (error) {
			return { success: false, message: 'Backend nicht erreichbar.' };
		}
	}
};