import { isAuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export type ActionData =
  | { error: string; values: { email: string } }
  | { message: string; values: { email: string } };

export const actions = {
  default: async ({ request, url, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;
    const values = { email: email ?? '' };

    if (!email) {
      return fail(400, { error: 'Please enter your email.', values });
    }
    if (!password) {
      return fail(400, { error: 'Please enter a password.', values });
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${url.origin}/auth/callback` },
      });

      if (error) {
        console.error('Supabase SignUp Error:', error);
        switch (error.code) {
          case 'email_exists':
            return fail(409, { error: 'This email is already registered.', values });
          case 'weak_password':
            return fail(422, {
              error: 'Password is too weak. Ensure it’s at least 6 characters long, including letters and numbers.',
              values,
            });
          case 'over_email_send_rate_limit':
            return fail(429, {
              error: 'Too many signup requests. Please wait and try again later.',
              values,
            });
          default:
            return fail(500, { error: 'Unexpected error. Please try again later.', values });
        }
      }

      return { message: 'Please check your email for a magic link to log into the website.', values };
    } catch (err) {
      console.error('Unexpected Error during SignUp:', err);
      return fail(500, { error: 'Unexpected error. Please try again later.', values });
    }
  },
} satisfies Actions;

export const load = async ({ locals }) => {
  if (locals.session) {
    throw redirect(303, '/');
  }
};
