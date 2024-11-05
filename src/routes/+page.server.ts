import { AuthApiError, type Provider } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	'signinWithPassword': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email) {
			return fail(400, {
				signinWithPassword: {
					error: 'Please enter your email',
					values: { email: '' }
				}
			});
		}

		if (!password) {
			return fail(400, {
				signinWithPassword: {
					error: 'Please enter your password',
					values: { email }
				}
			});
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					signinWithPassword: {
						error: 'Invalid credentials.',
						values: { email }
					}
				});
			}
			return fail(500, {
				signinWithPassword: {
					error: 'Server error. Try again later.',
					values: { email }
				}
			});
		}

		throw redirect(303, '/profile');
	},

	'signinWithOAuth': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const provider = formData.get('provider')?.toString();

		const {
			data: { url: oAuthUrl }
		} = await supabase.auth.signInWithOAuth({
			provider: provider as Provider,
			options: {
				redirectTo: `${url.origin}/auth/callback`
			}
		});

		if (!oAuthUrl) {
			return fail(500, {
				signinWithOAuth: {
					error: `Could not get provider URL for ${provider}`
				}
			});
		}

		throw redirect(303, oAuthUrl);
	},

	'sendMagicLink': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		if (!email) {
			return fail(400, {
				sendMagicLink: {
					error: 'Please enter your email',
					values: { email: '' }
				}
			});
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			console.error(`SendMagicLink Error for ${email}:`, error);
			return fail(500, {
				sendMagicLink: {
					error: 'Could not send magic link',
					values: { email }
				}
			});
		}

		return {
			sendMagicLink: {
				success: true,
				values: { email }
			}
		};
	}
};
