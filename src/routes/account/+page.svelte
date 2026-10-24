<script>
    let { data } = $props();
    let { user, isAuthenticated } = data;
</script>

<div class="container mt-4">
    <h1>Account Details</h1>

    {#if isAuthenticated}
        {#if user.picture}
            <p>
                <img src={user.picture} alt="Profile" class="rounded" width="80" />
            </p>
        {/if}
        <p><b>Name:</b> {user.name}</p>
        <p><b>Nickname:</b> {user.nickname}</p>
        <p><b>First Name:</b> {user.given_name}</p>
        <p><b>Last Name:</b> {user.family_name}</p>
        <p><b>Email:</b> {user.email}</p>

        <!-- Show roles only if user has at least one role -->
        {#if user.user_roles && user.user_roles.length > 0}
            <p><b>Roles:</b> {user.user_roles}</p>
        {/if}
    {:else}
        <p>Not logged in</p>
    {/if}
</div>