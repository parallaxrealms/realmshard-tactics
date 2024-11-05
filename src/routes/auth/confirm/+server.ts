import { redirect } from '@sveltejs/kit';
import { type EmailOtpType } from '@supabase/supabase-js';

export const GET = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event;

  const token_hash = url.searchParams.get('token_hash') as string;
  const type = url.searchParams.get('type') as EmailOtpType | null;
  const next = url.searchParams.get('next') ?? '/';

  const redirectTo = new URL(url);
  redirectTo.pathname = next;
  redirectTo.searchParams.delete('token_hash');
  redirectTo.searchParams.delete('type');
  redirectTo.searchParams.delete('next');

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return redirect(303, redirectTo.toString());
    }
  }

  // If verification fails, send the user to an error page
  redirectTo.pathname = '/auth/error';
  throw redirect(303, redirectTo.toString());
};
