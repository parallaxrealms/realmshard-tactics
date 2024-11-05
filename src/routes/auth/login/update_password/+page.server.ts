import { AuthApiError } from "@supabase/supabase-js"
import { fail, redirect } from "@sveltejs/kit"

export const actions = {
  update_password: async ({ request, locals }) => {
    const formData = await request.formData();
    const password = formData.get('new_password') as string | null;
    const confirmPassword = formData.get('password_confirm') as string | null;


    if (!password || password !== confirmPassword) {
      return fail(400, {
        update_password: {
          error: 'Passwords do not match or are empty.',
          values: { password, confirmPassword }
        }
      });
    }

    const { error: err } = await locals.supabase.auth.updateUser({
      password
    });

    if (err) {
      if (err instanceof AuthApiError && err.status >= 400 && err.status < 500) {
        return fail(400, {
          update_password: {
            error: 'Failed to update password. Please try again.',
            message: err.message
          }
        });
      }
      return fail(500, {
        update_password: {
          error: 'Server error. Please try again later.'
        }
      });
    }

    throw redirect(303, '/');
  }
};

export const load = async ({ locals }) => {
  if (!locals.session) {
    throw redirect(303, '/');
  }
};