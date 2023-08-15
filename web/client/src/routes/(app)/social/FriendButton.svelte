<script lang="ts">
  import type { UserData } from "../../../interfaces";
  import { dm, modalStatesStore, profileModalStore } from "../../../store";

	export let user: UserData;
	let isClicked: boolean = false;

	const friendButtonClickEvent = () => {
		isClicked = !isClicked;
	}

	const profileClickEvent = () => {
		$profileModalStore = user;
		$modalStatesStore.isProfileModal = true;
	}

	const chatClickEvent = async (): Promise<void> => {
		const response = await fetch(`http://localhost:3000/api/dm/history?other=${user.id}`, {
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
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--border-color);
		padding: 4px 10px 4px 10px;
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
        width: 20px;
		height: 20px;
    }

	.image-container {
		display: flex;
		justify-content: center;
	}
</style>
