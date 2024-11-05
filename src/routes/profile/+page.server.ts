import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase, session } }) => {
  const user_id = session?.user?.id;
  if (!user_id) {
    throw redirect(303, '/');
  }

  // Fetch user notes
  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('id, note')
    .eq('user_id', user_id)
    .order('id');

  if (notesError) {
    console.error('Error fetching notes:', notesError);
  }

  // Fetch user profile with additional fields (faction and rank)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, avatar_url, bio, faction, rank')
    .eq('id', user_id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  // Default avatar if none set
  const defaultAvatar = `${supabase.storage.from('avatars').getPublicUrl('avatar1.png').data.publicUrl}`;
  const avatarUrl = profile?.avatar_url || defaultAvatar;

  // Fetch avatar list from Supabase bucket
  const { data: avatarFiles, error: avatarsError } = await supabase.storage
    .from('avatars')
    .list();

  if (avatarsError) {
    console.error('Error fetching avatars:', avatarsError);
  }

  // Map avatar files to URLs
  const availableAvatars = avatarFiles
    ? avatarFiles.map((file) => `${supabase.storage.from('avatars').getPublicUrl(file.name).data.publicUrl}`)
    : [defaultAvatar];

  return {
    notes: notes ?? [],
    user: session.user,
    session,
    profile: {
      ...profile,
      avatar_url: avatarUrl, // Use default if none set
    },
    availableAvatars
  };
};
