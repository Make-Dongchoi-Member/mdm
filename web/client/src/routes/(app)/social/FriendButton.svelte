<script lang="ts">
  import { onMount } from "svelte";
  import type { UserData } from "../../../interfaces";
  import { apiUrl, dm, modalStatesStore, profileModalStore, socketStore } from "../../../store";
  import { UserState } from "../../../enums";

	export let user: UserData;
	let isClicked: boolean = false;

	onMount(() => {
		
	});

	const friendButtonClickEvent = () => {
		isClicked = !isClicked;
	}

	const profileClickEvent = () => {
		$profileModalStore = user;
		$modalStatesStore.isProfileModal = true;
	}

	const chatClickEvent = async (): Promise<void> => {
		const response = await fetch(`${apiUrl}/api/dm/history?other=${user.id}`, {
			method: "GET",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(response => response.json())
		.then(data => {
			$dm = {
				id: data.id,
				with: data.with as UserData,
				history: data.history
			};
			$dm = $dm;
		})
		.catch(error => console.error('Error:', error));
	}
</script>

<div class="profile">
	<button class="profile-button" on:click={friendButtonClickEvent}>
		<div class="image-container">
			{#if user.state === UserState.ONLINE}
			<div class="online"> </div>
			{:else if user.state === UserState.GAMING}
			<div class="gaming"> </div>
			{/if}
			<img class="profile-photo" src={user.avatar} alt={`${user.nickname}'s profile image`}>
		</div>
		<div>
			{user.nickname}
		</div>
	</button>
	{#if isClicked}
	<div class="menu-list">
		<button on:click={profileClickEvent}>PROFILE</button>
		<button on:click={chatClickEvent}>DM</button>
	</div>
	{/if}
</div>

<style>
	.profile-button {
		position: relative;
		width: 100%;
		height: 45px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--border-color);
		padding: 6px 10px 6px 10px;
		box-sizing: border-box;
		margin-bottom: 5px;
	}

	.profile-photo {
		border-radius: 70%;
		width: 20px;
		height: 20px;
	}

	.menu-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 5% 5% 5%;
	}

	.menu-list > button {
		width: 49%;
		font-size: 12px;
		margin-bottom: 2%;
	}

	.profile-photo {
		border-radius: 70%;
		width: 30px;
		height: 30px;
	}

	.image-container {
		position: relative;
		display: flex;
		justify-content: center;
	}

	.online {
		background-color: greenyellow;
		width: 10px;
		height: 10px;
		border-radius: 100px;
		position: absolute;
		top: 20px;
		right: -3px;
	}

	.gaming {
		background-color: var(--point-color);
		width: 10px;
		height: 10px;
		border-radius: 100px;
		position: absolute;
		top: 20px;
		right: -3px;
	}
</style>
