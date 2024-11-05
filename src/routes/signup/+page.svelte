<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';

	interface ActionData {
		error?: string;
		message?: string;
		values?: {
			email?: string;
		};
	}

	let { form } = $props() as { form: ActionData };
	let loading = $state(false);
	let isSignedUp = $state(false);

	const handleSubmit = ({ formElement }: { formElement: HTMLFormElement }) => {
		loading = true;

		return async ({ result }: { result: ActionResult }) => {
			await applyAction(result);

			if (result.type === 'success') {
				await invalidateAll();
				isSignedUp = true;
			} else if (result.type === 'failure') {
				form = result.data as ActionData;
			}
			loading = false;
		};
	};
</script>

<section class="container mt-6 flex pt-6">
	<div class="card w-4/5 text-center p-10 mx-auto">
		<div class="text-center">
			<p
				class="bg-gradient-to-br from-error-600 to-success-400 bg-clip-text text-transparent box-decoration-clone text-3xl py-4 px-4"
			>
				Sign Up
			</p>
		</div>
		<div>
			<form method="post" use:enhance={handleSubmit}>
				<!-- Email field -->
				<div class="field w-full md:w-[350px] mx-auto pb-4 text-surface-400">
					<label for="email" class="label">Email</label>
					<p class="control">
						<input
							id="email"
							name="email"
							value={form?.values?.email ?? ''}
							class="input pl-2"
							type="email"
							placeholder="Email"
							required
							disabled={isSignedUp}
						/>
					</p>
				</div>
				<!-- Password field -->
				<div class="field w-full md:w-[350px] mx-auto text-surface-400">
					<label for="password" class="label">Password</label>
					<p class="control">
						<input
							id="password"
							name="password"
							class="input pl-2"
							type="password"
							placeholder="Password"
							required
							disabled={isSignedUp}
						/>
					</p>
				</div>
				<!-- Submit button -->
				<div class="mt-6 text-center">
					<div class="field">
						<p class="control">
							<button
								disabled={loading || isSignedUp}
								type="submit"
								class="text-white font-semibold bg-surface-800 p-3 rounded-3xl px-4"
							>
								Confirm Sign Up
							</button>
						</p>
					</div>
				</div>
			</form>
		</div>

		<!-- Error and Success Messages -->
		<div class="mt-6">
			{#if form?.error}
				<div class="block notification is-danger text-red-400">
					{form.error}
				</div>
			{/if}
			{#if form?.message}
				<div class="block notification is-primary text-green-400">
					{form.message}
				</div>
			{/if}
		</div>
		<div class="mt-6">
			<p class="text-center font-semibold text-surface-400">
				Already have an account? <a
					href="/auth/login"
					class="font-semibold ml-2 text-white">Log In</a
				>
			</p>
		</div>
	</div>
</section>
