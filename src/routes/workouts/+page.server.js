import { API_BASE_URL } from '\$env/static/private';

export async function load() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workout`);
    if (!response.ok) {
      return { workouts: [] };
    }
    const workouts = await response.json();
    return { workouts };
  } catch (error) {
    console.error("Fehler beim Laden der Workouts:", error);
    return { workouts: [] };
  }
}

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    const workout = {
      athleteId: formData.get('athleteId'),
      sportType: formData.get('sportType'),
      distanceKm: parseFloat(formData.get('distanceKm')),
      workoutState: 'PLANNED'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workout)
      });

      if (!response.ok) {
        return { 
          success: false, 
          message: 'Fehler beim Erstellen des Workouts. Existiert der Athlet in der Datenbank?' 
        };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: 'Backend nicht erreichbar. Läuft der Spring-Boot-Server auf Port 8080?' 
      };
    }
  }
};