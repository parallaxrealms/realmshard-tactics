<script lang="ts">
	import { enhance } from '$app/forms';

	interface ActionData {
		update_password?: {
			error?: string;
			values?: {
				password?: string;
				confirmPassword?: string;
			};
		};
	}

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<div class="container mt-6 text-center text-surface-200">
	<h2>Change your password:</h2>
	{#if form?.update_password?.error}
		<p class="text-red-500">{form.update_password.error}</p>
	{/if}
	<form action="?/update_password" method="POST" use:enhance>
		<label for="new_password">New password</label>
		<input name="new_password" type="password" required />

		<label for="password_confirm">Confirm new password</label>
		<input name="password_confirm" type="password" required />

		<button type="submit" class="btn">Update Password</button>
	</form>
</div>
