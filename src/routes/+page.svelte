<script lang="ts">
	import type { Session, User } from '@supabase/supabase-js';

	let { data } = $props<{ session: Session | null; user: User | null }>();

	let session = $derived(() => data.session);
	let user = $derived.by(() => data.user);
</script>

<section class="flex container mx-auto mt-6 pt-6">
	<div
		class="card bg-surface-800 w-3/5 text-center p-10 rounded-xl shadow-xl mx-auto"
	>
		<span
			class="bg-gradient-to-br from-error-600 to-success-400 bg-clip-text text-transparent box-decoration-clone text-3xl"
			>Welcome,</span
		>
		{#if user}
			<span
				class="bg-gradient-to-br from-error-600 to-success-400 bg-clip-text text-transparent box-decoration-clone text-3xl"
				>{user?.email}</span
			>
			<a href="/profile">
				<button
					class="block mx-auto text-xl text-surface-300 bg-surface-900 p-3 rounded-3xl my-4 px-4"
				>
					Go To Dashboard
				</button>
			</a>
		{:else}
			<span
				class="bg-gradient-to-br from-error-600 to-success-400 bg-clip-text text-transparent box-decoration-clone text-3xl"
				>Guest</span
			>

			<p class="text-surface-300 my-2 text-lg">
				If you Log In, you will be able to view your dashboard and user profile.
			</p>
		{/if}
	</div>
</section>

<style>
</style>
