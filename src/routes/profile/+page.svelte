<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';
	import type { PageData } from './$types';
	import type { Session, User } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';
	import DeploymentGrid from '$lib/components/DeploymentGrid.svelte';

	let { data, form } = $props<{
		notes: any[];
		supabase: any;
		user: User | null;
		session: Session | null;
		profile: any;
	}>();

	let notes = $derived.by(() => data.notes);
	let supabase = $derived.by(() => data.supabase);
	let user = $derived.by(() => data.user);

	// User details to be edited
	let email: string = data.session?.user?.email ?? '';
	let username = $state(data.profile?.username ?? '');
	let bio = $state(data.profile?.bio ?? '');
	let avatar = $state(data.profile.avatar_url);
	let faction = $state(data.profile.faction ?? 1);
	let rank = $state(data.profile.rank ?? 0);

	// List of avatars fetched from Supabase
	const availableAvatars = data.availableAvatars;

	// Function to get faction name based on faction number
	function getFactionName(faction: number): string {
		switch (faction) {
			case 1:
				return 'Kingdoms';
			case 2:
				return 'Graves';
			case 3:
				return 'Wilds';
			case 4:
				return 'Discord';
			default:
				return 'Unknown';
		}
	}

	async function updateProfile() {
		const updates = {
			username,
			bio,
			avatar_url: avatar,
			faction,
			rank,
		};

		// Update profile in Supabase (excluding email)
		const { error } = await supabase
			.from('profiles')
			.update(updates)
			.eq('id', user?.id);

		if (error) {
			console.error('Error updating profile:', error.message);
			alert('Failed to update profile.');
		} else {
			alert('Profile updated successfully!');
		}
	}
</script>

<div class="flex container h-full">
	<!-- Left Column: Profile -->
	<div
		class="hero w-1/2 p-4 border-r-2 border-dotted border-surface-600 overflow-y-auto text-center text-surface-300"
	>
		{#if user}
			<section class="h-full flex flex-col justify-center items-center">
				<div class="flex w-full max-w-5xl">
					<div
						class="bg-text p-8 rounded bg-gradient-to-tr from-surface-600 via-surface-400 to-surface-600 w-2/3 relative text-surface-200"
					>
						<div class="text-center">
							<h1 class="shadow-text text-xl font-bold p-2 text-surface-100">
								Edit Your Profile
							</h1>
							<p class="text-lg mt-1">Update your details below</p>
						</div>

						<form class="mt-4 space-y-4" onsubmit={updateProfile}>
							<div class="flex flex-row">
								<div class="flex-1">
									<label for="email" class="block text-left">Email</label>
									<p
										class="block text-left text-lg font-semibold text-surface-900 max-w-[300px] h-1/2 overflow-x-scroll"
									>
										{email}
									</p>
								</div>
								<div class="flex-2">
									<label for="avatar" class="block text-center">Avatar</label>
									<img src={avatar} alt="Avatar" class="w-full rounded-sm" />
								</div>
							</div>
							<div>
								<label for="username" class="block text-left">Username</label>
								<input
									id="username"
									type="text"
									bind:value={username}
									class="input input-bordered w-full mt-2 p-1 bg-surface-700"
								/>
							</div>
							<div>
								<label for="bio" class="block text-left">Bio</label>
								<textarea
									id="bio"
									bind:value={bio}
									class="textarea textarea-bordered w-full p-1 bg-surface-700"
									rows="3"
									placeholder="Write something about yourself..."
								></textarea>
							</div>

							<!-- Faction and Rank Fields -->
							<div class="w-4/5 mx-auto">
								<div
									class="faction-card flex items-center justify-center py-4 bg-surface-950 rounded-sm px-4"
									class:kingdoms-bg={faction === 1}
									class:graves-bg={faction === 2}
									class:wilds-bg={faction === 3}
									class:discord-bg={faction === 4}
								>
									{#if faction === 1}
										<!-- Kingdoms Card -->
										<div
											class="flex items-center space-x-2 bg-faction-text rounded-full p-2"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#fff"
												stroke-width="1.25"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="lucide lucide-castle"
												><path
													d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
												/><path d="M18 11V4H6v7" /><path
													d="M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4"
												/><path d="M22 11V9" /><path d="M2 11V9" /><path
													d="M6 4V2"
												/><path d="M18 4V2" /><path d="M10 4V2" /><path
													d="M14 4V2"
												/></svg
											>
											<span class="text-cyan-300 font-semibold">Kingdoms</span>
											<span class="pl-1 text-cyan-100">Rank {rank}</span>
										</div>
									{:else if faction === 2}
										<!-- Graves Card -->
										<div
											class="flex items-center space-x-2 bg-faction-text rounded-full p-2"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#ffffff"
												stroke-width="1.25"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="lucide lucide-skull"
												><path d="m12.5 17-.5-1-.5 1h1z" /><path
													d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"
												/><circle cx="15" cy="12" r="1" /><circle
													cx="9"
													cy="12"
													r="1"
												/></svg
											>
											<span class="text-gray-300 font-semibold">Graves</span>
											<span class="pl-1 text-gray-100">Rank {rank}</span>
										</div>
									{:else if faction === 3}
										<!-- Wilds Card -->
										<div
											class="flex items-center space-x-2 bg-faction-text rounded-full p-2"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#ffffff"
												stroke-width="1.25"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="lucide lucide-leaf"
												><path
													d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
												/><path
													d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
												/></svg
											>
											<span class="text-green-300 font-semibold">Wilds</span>
											<span class="pl-1 text-green-100">Rank {rank}</span>
										</div>
									{:else if faction === 4}
										<!-- Discord Card -->
										<div
											class="flex items-center space-x-2 bg-faction-text rounded-full p-2"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#ffffff"
												stroke-width="1.25"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="lucide lucide-flame"
												><path
													d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
												/></svg
											>
											<span class="text-red-500 font-semibold">Discord</span>
											<span class="pl-1 text-red-100">Rank {rank}</span>
										</div>
									{/if}

									<!-- Right-aligned Button -->
									<button
										type="button"
										class="btn btn-sm rounded-sm preset-filled-primary-600-400 px-2 ml-auto"
										onclick={() => console.log('Change Faction')}
									>
										Change Faction
									</button>
								</div>
							</div>

							<div class="">
								<button
									type="submit"
									class="btn preset-outlined-primary-500 hover:preset-filled-primary-500 rounded-sm"
									>Save Changes</button
								>
							</div>
						</form>
					</div>

					<div class="bg-text ml-0 p-2 rounded bg-surface-500 w-1/3">
						<div class="text-center">
							<h1 class="shadow-text text-md p-2 text-surface-100">
								Choose Avatar
							</h1>
							<div class="avatar-grid grid grid-cols-3 mt-2 overflow-y-auto">
								{#each availableAvatars as avatarUrl}
									<button
										type="button"
										onclick={() => (avatar = avatarUrl)}
										class="w-full cursor-pointer rounded-sm border-2 border-transparent hover:border-surface-200"
									>
										<img
											src={avatarUrl}
											alt="Avatar"
											class="avatar h-full w-full rounded-sm"
										/>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</section>
		{:else}
			<p>No user session available.</p>
		{/if}
	</div>
	<!-- Right Column: Army -->
	<div class="w-1/2 bg-surface-950 p-4 text-center text-surface-300">
		<h1 class="shadow-text text-xl text-surface-100">Starting Deployment</h1>
		<div class="battlefield-grid">
			<DeploymentGrid />
		</div>
	</div>
</div>
<div class="container h-full bg-surface-500 text-center mx-auto">
	<div class="w-full">
		<h1 class="shadow-text text-lg text-surface-100">Available Units</h1>
		<!-- Horizontal Scrolling Cards Container -->
		<div class="unit-cards-container justify-center">
			{#each Array(8) as _, index}
				<button
					class="unit-card rounded-sm bg-surface-800"
					onclick={() => console.log(`Card ${index}`)}
				>
					<div class="card-content">
						<p>Unit {index + 1}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
	}
	.hero {
		background-image: url('/images/profile_hero.png');
		background-size: cover;
		background-position: center;
		text-align: center;
	}

	.battlefield-grid {
		display: flex;
		flex-direction: column;
		justify-content: end;
		padding-bottom: 20px;
	}

	.bg-text {
		--tw-bg-opacity: 0.95;
		box-shadow: rgba(0, 0, 0, 0.8) 5px 5px 20px 5px;
	}
	.bg-faction-text {
		background-color: rgba(0, 0, 0, 0.6);
		box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 10px;
	}

	.shadow-text {
		text-shadow: #000000 1px 1px 8px;
	}

	.kingdoms-bg {
		background-image: url('/images/btn_bg_kingdoms.png');
		background-size: cover;
	}
	.graves-bg {
		background-image: url('/images/btn_bg_graves.png');
		background-size: cover;
	}
	.wilds-bg {
		background-image: url('/images/btn_bg_wilds.png');
		background-size: cover;
	}
	.discord-bg {
		background-image: url('/images/btn_bg_discord.png');
		background-size: cover;
	}

	.avatar {
		transition: border-color 0.2s ease;
	}

	.avatar:hover {
		border-color: #ff6600;
	}

	.avatar-grid {
		scrollbar-width: thin;
		scrollbar-color: #ff6600 transparent;
	}

	.avatar-grid::-webkit-scrollbar {
		width: 6px;
	}

	.avatar-grid::-webkit-scrollbar-track {
		background: transparent;
	}

	.avatar-grid::-webkit-scrollbar-thumb {
		background-color: #ff6600;
		border-radius: 10px;
	}

	.unit-cards-container {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		padding: 0.5em;
		scroll-snap-type: x mandatory;
	}

	.unit-cards-container::-webkit-scrollbar {
		height: 8px; /* Custom scrollbar height */
	}

	.unit-cards-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.unit-cards-container::-webkit-scrollbar-thumb {
		background-color: #ff6600;
		border-radius: 4px;
	}

	.unit-card {
		width: calc(2 * 3rem); /* Adjust for aspect ratio of 2:3 */
		height: calc(3 * 3rem);
		flex-shrink: 0;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-weight: bold;
		scroll-snap-align: start;
		transition: transform 0.2s ease;
		cursor: pointer;
	}

	.unit-card:hover {
		transform: scale(1.15);
	}
</style>
