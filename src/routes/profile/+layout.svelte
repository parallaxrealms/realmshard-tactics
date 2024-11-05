<script lang="ts">
	  import { invalidate } from '$app/navigation';
  import { applyAction, enhance } from '$app/forms';
  import type { Session } from '@supabase/supabase-js';
	import type { ActionResult } from '@sveltejs/kit';

  let { children, data } = $props();
	let supabase = $derived(() => data.supabase);

	let loading = $state(false);

	const handleLogout = ({ formElement }: { formElement: HTMLFormElement }) => {
  loading = true;

  return async ({ action }: { action: URL }) => {
    const formData = new FormData(formElement);
    const response = await fetch(action, {
      method: 'POST',
      body: formData,
    });

    const result: ActionResult = await response.json();
    await applyAction(result);
    await invalidate('supabase:auth');
    loading = false;
  };
};
</script>

<main>
	{@render children()}
</main>
