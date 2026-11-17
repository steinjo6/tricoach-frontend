<script>
  let { data, form } = $props();
  let { user, workouts, nrOfPages, currentPage } = $derived(data);
  let currentUserEmail = $derived(user?.email || user?.name);
</script>

{#if user?.user_roles?.includes('admin')}
  <div class="row">
    <div class="col-md-6 mb-4">
      <h2>Create Workout</h2>

      {#if form?.success}
        <div class="alert alert-success" role="alert">
          Aktion erfolgreich ausgeführt!
        </div>
      {:else if form?.message}
        <div class="alert alert-danger" role="alert">
          {form.message}
        </div>
      {/if}

      <form method="POST" action="?/createWorkout">
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
{/if}

<div class="row">
  <div class="col-12">
    <h2>All Workouts</h2>

    <table class="table table-striped table-hover mt-3 align-middle">
      <thead>
        <tr>
          <th>ID</th>
          <th>Athlete ID</th>
          <th>Sportart</th>
          <th>Distanz (km)</th>
          <th>Assigned To</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if workouts && workouts.length > 0}
          {#each workouts as workout}
            <tr>
              <td><code>{workout.id}</code></td>
              <td>{workout.athleteId}</td>
              <td><span class="badge bg-secondary">{workout.sportType}</span></td>
              <td>{workout.distanceKm} km</td>
              <td>{workout.assignedTo || '-'}</td>
              <td>
                {#if workout.workoutState === 'COMPLETED'}
                  <span class="badge bg-success">{workout.workoutState}</span>
                {:else if workout.workoutState === 'ASSIGNED'}
                  <span class="badge bg-info text-dark">{workout.workoutState}</span>
                {:else}
                  <span class="badge bg-warning text-dark">{workout.workoutState}</span>
                {/if}
              </td>
              <td>
                {#if workout.workoutState === 'PLANNED'}
                  <form method="POST" action="?/assignToMe" style="display: inline;">
                    <input type="hidden" name="workoutId" value={workout.id} />
                    <button type="submit" class="btn btn-sm btn-outline-primary">Assign to me</button>
                  </form>
                {:else if workout.workoutState === 'ASSIGNED'}
                  <span class="badge bg-info text-dark me-1">Assigned</span>
                  {#if workout.assignedTo === currentUserEmail}
                    <form method="POST" action="?/completeMyWorkout" style="display: inline;">
                      <input type="hidden" name="workoutId" value={workout.id} />
                      <button type="submit" class="btn btn-sm btn-success">Complete Workout</button>
                    </form>
                  {/if}
                {:else if workout.workoutState === 'COMPLETED'}
                  <span class="badge bg-success">Done</span>
                {/if}
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="7" class="text-muted">Keine Workouts vorhanden oder Backend nicht verbunden.</td>
          </tr>
        {/if}
      </tbody>
    </table>

    {#if nrOfPages > 0}
      <nav aria-label="Page navigation">
        <ul class="pagination">
          {#each Array(nrOfPages) as _, i}
            <li class="page-item" class:active={currentPage === i + 1}>
              <a class="page-link" href="/workouts?pageNumber={i + 1}">{i + 1}</a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </div>
</div>