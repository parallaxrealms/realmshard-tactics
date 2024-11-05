<script lang="ts">
  import "../app.css";
  import { invalidate } from '$app/navigation';
  import { applyAction, enhance } from '$app/forms';
  import type { Session } from '@supabase/supabase-js';
	import type { ActionResult } from '@sveltejs/kit';

  let { children, data } = $props();

  let loading = $state(false);

  let supabase = $derived.by(() => data.supabase);
  let session = $derived.by(() => data.session);

	const handleLogout = ({ formElement }: { formElement: HTMLFormElement }) => {
  loading = true;

  return async ({ action }: { action: URL }) => {
    const formData = new FormData(formElement);
    const response = await fetch(action, {
      method: 'POST',
      body: formData,
    });

    const result: ActionResult = await response.json();
    await applyAction(result);
    await invalidate('supabase:auth');
    loading = false;
  };
};
</script>
<nav class="top-0 py-2 w-full bg-surface-700"
>
	<div class="w-auto text-center">
		<a class="my-2" href="/"
			><h1
				class="title-text text-xl bg-gradient-to-br from-primary-400 to-error-500 bg-clip-text text-transparent box-decoration-clone font-semibold"
				>Realmshard Tactics</h1
			></a
		>
	</div>
	<div class="absolute flex top-0 left-0 mt-2 ml-2">
		<a href="/" aria-label="home">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a39e9a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-castle"><path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M18 11V4H6v7"/><path d="M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4"/><path d="M22 11V9"/><path d="M2 11V9"/><path d="M6 4V2"/><path d="M18 4V2"/><path d="M10 4V2"/><path d="M14 4V2"/></svg></a
		>
		{#if session}
		<a href="/" class="pl-4 pr-1" aria-label="currency">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d9b430" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg></a> <span class="coins-text text-surface-200 text-md"> 0</span>
		{/if}
	</div>
	{#if session}
		<div class="absolute top-0 right-0 mr-4">
			<form action="/auth/logout" method="post" use:enhance={handleLogout}>
				<button
					disabled={loading}
					class="btn p-2 text-surface-100"
					type="submit">Sign out</button
				>
			</form>
		</div>
	{:else}
		<div class="absolute top-0 right-0 mr-4">
			<a href="/auth/login">
				<button
					disabled={loading}
					class="btn mt-1 p-1 text-surface-200"
					type="submit">Log In</button
				></a
			>
		</div>
	{/if}
</nav>
<main class="">
	{@render children()}
</main>
<footer
	class="fixed bottom-0 w-screen bg-surface-700 text-center"
>
	<div class="container mx-auto">
		<div class="flex items-center justify-center">
			<p class="text-surface-200">
				<span class="ml-2 text-sm"
					>Powered by Satori Digital 
					<a href="http://www.satoridigital.io">
						<img
							src="/images/satori-logo.png"
							class="w-8 h-8 mx-1 mb-1 inline"
							alt="satori logo"
						/>
					</a>
				</span>
			</p>
		</div>
	</div>
</footer>

<style>
	.title-text{
		text-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
	}
	.coins-text{
		color: #d9b430;
	}
</style>