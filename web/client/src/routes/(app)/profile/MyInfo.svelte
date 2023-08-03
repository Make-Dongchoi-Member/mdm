<script lang="ts">
    import { modalStatesStore, myData } from "../../../store";
	import MatchStat from "./MatchStat.svelte";
</script>

<div class="personal_box">
	<button type="button" class="profile_image_circle">
		<img class="image" src="/asset/hhwang.png" alt="profile_image">
	</button>
	<div class="personal_info">
		<button on:click={() => {$modalStatesStore.isNicknameModal = true}}>
			{$myData.nickname}
		</button>
		<button on:click={() => {$modalStatesStore.isLogoutModal = true}}>
			LOGOUT
		</button>
	</div>
</div>
<div class="stat_box">
	<MatchStat />
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
		width: 60%;

		padding-left: 5.5%;
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

	.profile_image_circle:hover {
		border: 2px solid white;
		cursor: pointer;
		opacity: 0.5;
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
	}
</style>
