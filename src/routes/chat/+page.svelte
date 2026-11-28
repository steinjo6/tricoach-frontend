<script>
	import { tick } from 'svelte';

	let messages = $state([
		{
			role: 'assistant',
			content:
				'Hallo! Ich bin dein TriCoach AI-Assistent. Frag mich nach deinen Workouts, Athleten oder Trainingsplänen.'
		}
	]);
	let input = $state('');
	let loading = $state(false);
	let errorMessage = $state('');
	let chatContainer = $state(null);

	const suggestions = [
		'Welche Workouts sind aktuell gespeichert?',
		'Zeige mir alle Athleten in TriCoach.',
		'Gib mir eine kurze Übersicht über meine letzten Trainings.'
	];

	async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	async function sendMessage(customPrompt = null) {
		const text = (customPrompt ?? input).trim();
		if (!text || loading) return;

		errorMessage = '';
		messages = [...messages, { role: 'user', content: text }];
		if (!customPrompt) input = '';
		loading = true;
		await scrollToBottom();

		try {
			const res = await fetch('/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text })
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.message || `Anfrage fehlgeschlagen (${res.status})`);
			}

			messages = [...messages, { role: 'assistant', content: data.reply }];
		} catch (err) {
			errorMessage = err.message || 'Verbindung zum TriCoach-Backend fehlgeschlagen.';
		} finally {
			loading = false;
			await scrollToBottom();
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		sendMessage();
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="chat-wrapper">
	<header class="chat-header">
		<h1>TriCoach AI Chat</h1>
		<p>Direkter Zugriff auf deine Workouts und Athletendaten</p>
	</header>

	<div class="suggestions">
		{#each suggestions as suggestion}
			<button
				type="button"
				class="suggestion-chip"
				disabled={loading}
				onclick={() => sendMessage(suggestion)}
			>
				{suggestion}
			</button>
		{/each}
	</div>

	<div class="messages" bind:this={chatContainer}>
		{#each messages as msg}
			<div class="message-row {msg.role}">
				<div class="bubble">
					<span class="sender">{msg.role === 'user' ? 'Du' : 'TriCoach AI'}</span>
					<p>{msg.content}</p>
				</div>
			</div>
		{/each}

		{#if loading}
			<div class="message-row assistant">
				<div class="bubble typing">
					<span class="sender">TriCoach AI</span>
					<p>Analysiert deine Daten...</p>
				</div>
			</div>
		{/if}
	</div>

	{#if errorMessage}
		<div class="error-banner">{errorMessage}</div>
	{/if}

	<form class="input-bar" onsubmit={handleSubmit}>
		<textarea
			rows="2"
			bind:value={input}
			onkeydown={handleKeydown}
			placeholder="Nachricht an TriCoach senden... (Enter zum Senden, Shift+Enter für Zeilenumbruch)"
			disabled={loading}
		></textarea>
		<button type="submit" disabled={loading || !input.trim()}>
			{loading ? 'Sendet...' : 'Senden'}
		</button>
	</form>
</div>

<style>
	.chat-wrapper {
		max-width: 820px;
		margin: 1.5rem auto;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 140px);
		min-height: 500px;
	}

	.chat-header h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.chat-header p {
		margin: 0.25rem 0 0.75rem;
		color: #64748b;
		font-size: 0.9rem;
	}

	.suggestions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.suggestion-chip {
		background: #f1f5f9;
		border: 1px solid #cbd5e1;
		border-radius: 999px;
		padding: 0.35rem 0.75rem;
		font-size: 0.8rem;
		cursor: pointer;
		color: #1e293b;
	}

	.suggestion-chip:hover:not(:disabled) {
		background: #e2e8f0;
	}

	.messages {
		flex: 1;
		overflow-y: auto;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1rem;
		background: #f8fafc;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.message-row {
		display: flex;
	}

	.message-row.user {
		justify-content: flex-end;
	}

	.message-row.assistant {
		justify-content: flex-start;
	}

	.bubble {
		max-width: 78%;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		line-height: 1.45;
		white-space: pre-wrap;
	}

	.user .bubble {
		background: #2563eb;
		color: #ffffff;
	}

	.assistant .bubble {
		background: #ffffff;
		color: #0f172a;
		border: 1px solid #e2e8f0;
	}

	.sender {
		display: block;
		font-size: 0.72rem;
		font-weight: 600;
		opacity: 0.75;
		margin-bottom: 0.25rem;
	}

	.bubble p {
		margin: 0;
	}

	.typing p {
		font-style: italic;
		color: #64748b;
	}

	.error-banner {
		margin-top: 0.5rem;
		padding: 0.6rem 0.85rem;
		border-radius: 0.5rem;
		background: #fee2e2;
		color: #991b1b;
		font-size: 0.875rem;
	}

	.input-bar {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	textarea {
		flex: 1;
		resize: none;
		border: 1px solid #cbd5e1;
		border-radius: 0.5rem;
		padding: 0.65rem 0.8rem;
		font-family: inherit;
		font-size: 0.95rem;
	}

	textarea:focus {
		outline: 2px solid #2563eb;
		border-color: transparent;
	}

	button[type='submit'] {
		padding: 0 1.25rem;
		border: none;
		border-radius: 0.5rem;
		background: #2563eb;
		color: #ffffff;
		font-weight: 600;
		cursor: pointer;
	}

	button[type='submit']:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>