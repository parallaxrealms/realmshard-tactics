import { fail, redirect } from "@sveltejs/kit";
import { AuthApiError } from "@supabase/supabase-js";

export const actions = {
  reset_password: async ({ request, locals }) => {
    const formData = await request.formData();
    const emailEntry = formData.get('email');

    if (!emailEntry || typeof emailEntry !== 'string') {
      return fail(400, {
        reset_password: {
          error: 'Please enter a valid email.',
          values: { email: '' }
        }
      });
    }

    const email = emailEntry.trim();

    const { error: err } = await locals.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `/auth/login/update_password`
    });

    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, {
          reset_password: {
            error: 'Could not find user with this email.',
            values: { email }
          }
        });
      }
      return fail(500, {
        reset_password: {
          error: 'Server error. Please try again later.',
          values: { email }
        }
      });
    }

    return {
      reset_password: {
        success: true,
        values: { email }
      }
    };
  }
};

export const load = async ({ locals }) => {
  if (locals.session) {
    throw redirect(303, '/');
  }
};
