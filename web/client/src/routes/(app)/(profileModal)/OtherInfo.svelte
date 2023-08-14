<script lang="ts">
	import MatchStat from "./MatchStat.svelte";
	import { profileModalStore } from "../../../store";
  import { onDestroy, onMount } from "svelte";
  import type { OtherUserData } from "../../../interfaces";

	let userData: OtherUserData;

	onMount(() => {
		getUserData();
	});

	onDestroy(() => {

	});

	const getUserData = async () => {
		const nickname: string = $profileModalStore.nickname;
		const uri: string = `http://localhost:3000/api/user/info?nickname=${nickname}`;
		const response = await fetch(uri, {
			method: "GET",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(response => response.json())
		.then(data => {
			userData = data;
			console.log(userData);
			
		})
		.catch(error => console.error('Error:', error));
	}
</script>

<div class="personal_box">
	<button type="button" class="profile_image_circle" disabled>
		<img class="image" src="/asset/hhwang.png" alt="profile_image">
	</button>
	<div class="personal_info">
		<button disabled>
			{userData ? userData.nickname : ""}
		</button>
		<button disabled>
			{userData ? userData.state?.toUpperCase() : ""}
		</button>
	</div>
</div>
<div class="stat_box">
	<MatchStat />
</div>
<div class="option_box">
	<button>
		FOLLOW
	</button>
	<button>
		PLAY WITH
	</button>
	<button>
		BLOCK
	</button>
</div>

<style>
	.personal_box {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%
	}

	.stat_box {
		display: flex;
		flex-direction: column;
		width: 50%
		
	}

	.option_box {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		width: 25%;
		flex-grow: 1;
	}

	.option_box > button {
		width: 150px;
		height: 40px;
		margin-bottom: 20px;
		background-color: var(--dark-color);
	}

	.option_box > button:hover {
		background-color: var(--hover-color);
	}

	.profile_image_circle {
		width: 120px;
		height: 120px;
		border: 1px solid var(--border-color);
		border-radius: 70%;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		margin: 20px;
	}

	.profile_image_circle > .image {
		width: 115%;
		height: 115%;
		object-fit: cover;
	}

	.personal_info {
		width: 150px;
		height: 80px;
		display: flex;
		flex-direction: column;
	}

	.personal_info > button {
		width: 150px;
		margin-bottom: 10px;
		background-color: var(--dark-color);
	}
</style>
