<script>
  let { data, form } = $props();
</script>

<div class="row">
  <div class="col-md-6 mb-4">
    <h2>Create Workout</h2>

    {#if form?.success}
      <div class="alert alert-success" role="alert">
        Workout erfolgreich erfasst!
      </div>
    {:else if form?.message}
      <div class="alert alert-danger" role="alert">
        {form.message}
      </div>
    {/if}

    <form method="POST">
      <div class="mb-3">
        <label for="athleteId" class="form-label">Athlete ID</label>
        <input 
          type="text" 
          class="form-control" 
          id="athleteId" 
          name="athleteId" 
          placeholder="z. B. 6ad72ceaefdac68d61369a7e" 
          required 
        />
      </div>

      <div class="mb-3">
        <label for="sportType" class="form-label">Sportart</label>
        <select class="form-select" id="sportType" name="sportType" required>
          <option value="RUN">RUN</option>
          <option value="BIKE">BIKE</option>
          <option value="SWIM">SWIM</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="distanceKm" class="form-label">Distanz (km)</label>
        <input 
          type="number" 
          step="0.1" 
          class="form-control" 
          id="distanceKm" 
          name="distanceKm" 
          placeholder="10.5" 
          required 
        />
      </div>

      <button type="submit" class="btn btn-primary">Create Workout</button>
    </form>
  </div>
</div>

<hr />

<div class="row">
  <div class="col-12">
    <h2>All Workouts</h2>

    <table class="table table-striped table-hover mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Athlete ID</th>
          <th>Sportart</th>
          <th>Distanz (km)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#if data.workouts && data.workouts.length > 0}
          {#each data.workouts as workout}
            <tr>
              <td><code>{workout.id}</code></td>
              <td>{workout.athleteId}</td>
              <td><span class="badge bg-secondary">{workout.sportType}</span></td>
              <td>{workout.distanceKm} km</td>
              <td>
                {#if workout.workoutState === 'COMPLETED'}
                  <span class="badge bg-success">{workout.workoutState}</span>
                {:else}
                  <span class="badge bg-warning text-dark">{workout.workoutState}</span>
                {/if}
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="5" class="text-muted">Keine Workouts vorhanden oder Backend nicht verbunden.</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>