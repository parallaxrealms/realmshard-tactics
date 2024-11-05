<script lang="ts">
	import { applyAction, enhance, deserialize } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import { page } from '$app/stores';

	interface ActionData {
		signinWithPassword?: {
			error?: string;
			values?: {
				email?: string;
			};
		};
		signinWithOAuth?: {
			error?: string;
		};
		sendMagicLink?: {
			error?: string;
			success?: boolean;
			values?: {
				email?: string;
			};
		};
		message?: string;
	}

	export let form: ActionData;

	let loading = false;

	const handleSubmit = ({ formElement }: { formElement: HTMLFormElement }) => {
		loading = true;

		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success') {
				await invalidateAll();
			}

			await applyAction(result);
			loading = false;
		};
	};
</script>

<section class="container mt-6 flex pt-6">
	<div class="card mx-auto w-4/5 p-10 text-center">
		<div class="text-center">
			<p
				class="bg-gradient-to-br from-error-600 to-success-400 bg-clip-text text-transparent box-decoration-clone text-3xl py-4"
			>
				Login
			</p>
		</div>
		<!-- OAuth Errors -->
		{#if form?.signinWithOAuth?.error}
			<div class="notification is-danger block py-4">
				{form.signinWithOAuth.error}
			</div>
		{/if}

		<!-- OAuth Sign-In Form -->
		<form
			class="mb-6"
			action="/?/signinWithOAuth"
			method="post"
			use:enhance={handleSubmit}
		>
			<div class="flex justify-center gap-8 text-surface-200">
				<span>Log in with: </span>
				<button class="button" name="provider" value="github" type="submit">
					GitHub
				</button>
				<button class="button" name="provider" value="google" type="submit">
					Google
				</button>
			</div>
		</form>

		<!-- Magic Link or Password Sign-In Forms -->
		{#if $page.url.searchParams.get('auth-type') === 'magiclink'}
			<!-- Display Errors for Magic Link -->
			{#if form?.sendMagicLink?.error}
				<div class="notification is-danger block py-4">
					{form.sendMagicLink.error}
				</div>
			{/if}

			<!-- Display Success Message for Magic Link -->
			{#if form?.sendMagicLink?.success}
				<div class="magic-text notification is-primary block">
					<p class="text-md py-2">
						Magic link sent to {form.sendMagicLink.values?.email}. Please check
						your email.
					</p>
				</div>
			{/if}

			<!-- Send Magic Link Form -->
			<form action="/?/sendMagicLink" method="post" use:enhance={handleSubmit}>
				<div class="field mx-auto w-full pb-4 md:w-[350px] text-surface-400">
					<label for="email" class="label">Email</label>
					<p class="control">
						<input
							id="email"
							name="email"
							value={form?.sendMagicLink?.values?.email ?? ''}
							class="input"
							type="email"
							placeholder="Email"
							required
						/>
					</p>
				</div>
				<div class="field">
					<div class="magic-text mt-1 text-center">
						<button
							type="submit"
							class="bg-surface-800 p-3 rounded-3xl px-4"
							disabled={loading}
						>
							<p class="text-center text-xl">Send magic link</p>
						</button>
					</div>
				</div>
			</form>

			<div class="mt-6 text-surface-200">
				<p class="text-center font-semibold">
					<a href="/auth/login">Sign in with email and password</a>
				</p>
			</div>
		{:else}
			<!-- Sign In with Password Form -->
			<form
				action="/?/signinWithPassword"
				method="post"
				use:enhance={handleSubmit}
			>
				<div class="field mx-auto w-full pb-4 md:w-[350px] text-surface-400">
					<label for="email" class="label">Email</label>
					<p class="control">
						<input
							id="email"
							name="email"
							value={form?.signinWithPassword?.values?.email ?? ''}
							class="input pl-2"
							type="email"
							placeholder="Email"
							required
						/>
					</p>
				</div>
				<div class="field mx-auto w-full md:w-[350px] text-surface-400">
					<label for="password" class="label">Password</label>
					<p class="control">
						<input
							id="password"
							name="password"
							class="input pl-2"
							type="password"
							placeholder="Password"
							required
						/>
					</p>
				</div>
				<div class="mt-6 text-center">
					<div class="field">
						<p class="control">
							<button
								disabled={loading}
								type="submit"
								class="text-white font-semibold bg-surface-800 p-3 rounded-3xl px-4"
							>
								Sign In
							</button>
						</p>
					</div>
				</div>
			</form>
			<!-- Display Errors -->
			{#if form?.signinWithPassword?.error}
				<div
					class="notification is-danger mt-4 block pt-2 text-xl text-red-400"
				>
					{form.signinWithPassword.error}
				</div>
				<div
					class="w-fit mx-auto mt-4 text-white bg-surface-700 bg-opacity-35 p-4 rounded-3xl"
				>
					Forgot Your Password? <a
						href="/auth/login/forgot_password"
						class="text-white bg-surface-800 p-1 px-4 rounded-3xl"
					>
						Reset Password
					</a>
				</div>
			{/if}

			<!-- Sign In with Magic Link Link -->
			<div class="magic-text text-center">
				<p class="py-4 text-center">
					<a href="?auth-type=magiclink">Sign in with magic link</a>
				</p>
			</div>

			<!-- Sign Up Link -->
			<div class="my-1">
				<p class="text-center font-semibold text-surface-400">
					Don't have an account?
					<a href="/signup" class="font-semibold ml-2 text-white"> Sign Up </a>
				</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.magic-text p {
		color: white;
		text-shadow: 0px 0px 4px #ffffff6c;
	}
</style>
