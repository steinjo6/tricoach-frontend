<script>
  let { data, form } = $props();
  let { user, athletes, nrOfPages, currentPage } = $derived(data);
</script>

{#if user?.user_roles?.includes('admin')}
  <div class="row">
    <div class="col-md-6 mb-4">
      <h2>Create Athlete</h2>

      {#if form?.success}
        <div class="alert alert-success" role="alert">
          Athlete erfolgreich erfasst!
        </div>
      {:else if form?.message}
        <div class="alert alert-danger" role="alert">
          {form.message}
        </div>
      {/if}

      <form method="POST">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" name="name" required />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input type="email" class="form-control" id="email" name="email" required />
        </div>

        <button type="submit" class="btn btn-primary">Create Athlete</button>
      </form>
    </div>
  </div>

  <hr />
{/if}

<div class="row">
  <div class="col-12">
    <h2>All Athletes</h2>

    <table class="table table-striped table-hover mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>E-Mail</th>
        </tr>
      </thead>
      <tbody>
        {#if athletes && athletes.length > 0}
          {#each athletes as athlete}
            <tr>
              <td><code>{athlete.id}</code></td>
              <td>{athlete.name}</td>
              <td>{athlete.email}</td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="3" class="text-muted">Keine Athletes vorhanden.</td>
          </tr>
        {/if}
      </tbody>
    </table>

    {#if nrOfPages > 0}
      <nav aria-label="Page navigation">
        <ul class="pagination">
          {#each Array(nrOfPages) as _, i}
            <li class="page-item" class:active={currentPage === i + 1}>
              <a class="page-link" href="/athletes?pageNumber={i + 1}">{i + 1}</a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </div>
</div>