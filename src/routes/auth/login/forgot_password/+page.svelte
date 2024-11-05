<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';

	interface ActionData {
		reset_password?: {
			error?: string;
			values?: {
				email?: string;
			};
		};
		message?: string;
	}

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let loading: boolean = $state(false);
	let formSent: boolean = $state(false);

	const handleSubmit = ({ formElement }: { formElement: HTMLFormElement }) => {
		loading = true;
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				formSent = true;
			} else {
				formSent = false;
			}
			loading = false;
		};
	};
</script>

<section class="flex container mt-6 pt-6">
	<div class="card w-4/5 text-center p-10 mx-auto text-surface-300">
		<h3 class="text-xl pb-4">Enter your email to reset your password.</h3>
		<form action="?/reset_password" method="POST" use:enhance={handleSubmit}>
			<div class="field w-full md:w-[350px] mx-auto pb-4">
				<label for="email" class="label inline">Email:</label>
				<input
					id="email"
					name="email"
					class="input pl-2 inline text-surface-800"
					type="email"
					placeholder="name@domain.com"
					required
					value={form?.reset_password?.values?.email ?? ''}
					disabled={formSent}
				/>
				{#if form?.reset_password?.error}
					<p class="text-red-500">{form.reset_password.error}</p>
				{/if}
				<button
					type="submit"
					class="text-white bg-surface-800 p-1 px-4 rounded-3xl my-4"
					disabled={loading || formSent}
				>
					{formSent ? 'Check Your Email' : 'Reset Password'}
				</button>
			</div>
		</form>
		{#if formSent}
			<p class="text-green-500 mt-4">
				Please check your email to reset your password.
			</p>
		{/if}
	</div>
</section>
