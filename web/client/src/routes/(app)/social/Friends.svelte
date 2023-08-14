<script lang="ts">
  import { myData } from "../../../store";
  import FriendButton from "./FriendButton.svelte";

</script>

<div class="members">
	<div class="other-profile-container">
		{#each $myData.friends as user}
		<FriendButton {user} />
		{/each}
	</div>
</div>

<style>
	.members {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 220px;
		height: 650px;
		border: 1px solid var(--border-color);
		font-size: 12px;
		box-sizing: border-box;
		padding-top: 5px;
	}

	.profile-id {
		font-size: 12px;
	}

	.other-profile-container {
		display: flex;
		flex-direction: column;
		width: 90%;
		height: 100%;
		overflow-y: auto;
	}

	.other-profile-container::-webkit-scrollbar {
		width: 6px;
		height: 30px;
	}

	.other-profile-container::-webkit-scrollbar-track {
		background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
	}

	.other-profile-container::-webkit-scrollbar-thumb {
		background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
		border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
	}

	.other-profile-container::-webkit-scrollbar-thumb:hover {
		background-color: var(--text-color) /* 스크롤바 썸바 호버 배경색 설정 */
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
