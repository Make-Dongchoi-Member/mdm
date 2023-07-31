<script lang="ts">
	import { modalStatesStore } from "../../../store";
	
	let members = [
		{ id: "dongchoi", avatarSrc: "/asset/hhwang.png" },
		{ id: "seonhoki", avatarSrc: "/asset/default_profile.png" },
		{ id: "jaewchoi", avatarSrc: "/asset/hhwang.png" },
		{ id: "sooyokim", avatarSrc: "/asset/hhwang.png" },
		{ id: "jinhokim", avatarSrc: "/asset/hhwang.png" },
		{ id: "chanhyle", avatarSrc: "/asset/hhwang.png" },
		{ id: "gyyu", avatarSrc: "/asset/hhwang.png" },
		{ id: "dongchoi2", avatarSrc: "/asset/default_profile.png" },
		{ id: "dongchoi3", avatarSrc: "/asset/default_profile.png" },
		{ id: "dongchoi4", avatarSrc: "/asset/default_profile.png" },
		{ id: "dongchoi5", avatarSrc: "/asset/default_profile.png" },
		{ id: "dongchoi6", avatarSrc: "/asset/default_profile.png" },
		{ id: "dongchoi7", avatarSrc: "/asset/default_profile.png" },
		{ id: "dongchoi8", avatarSrc: "/asset/default_profile.png" },
		{ id: "dongchoi9", avatarSrc: "/asset/default_profile.png" },
	]
</script>

<div class="data">
	{#each members as item}
	<button class="profile-button" on:click={ () => $modalStatesStore.isProfileModal = true }>
		<img src={item.avatarSrc} alt="profile_image">
		<div>
			{item.id}
		</div>
	</button>
	{/each}
</div>

<style>
	/* scroll bar */

	.data::-webkit-scrollbar {
		width: 6px;
		height: 30px;
	}

	.data::-webkit-scrollbar-track {
		background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
	}

	.data::-webkit-scrollbar-thumb {
		background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
		border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
	}

	.data::-webkit-scrollbar-thumb:hover {
		background-color: var(--text-color) /* 스크롤바 썸바 호버 배경색 설정 */
	}

	/* scroll bar */

	.data {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		width: 775px;
		height: 300px;

		overflow-y: auto;

		margin: 10px 10px 10px 15px;
	}

	.data > .profile-button {
		display: flex;
		align-items: center;
		text-align: left;

		height: 60px;
		width: 374px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.data > .profile-button > :nth-child(1) {
		display: flex;

		border-radius: 70%;
		width: 40px;
		height: 40px;
		margin-left: 20px;
		margin-right: 20px;
	}

	.data > .profile-button > :nth-child(2) {
		flex-grow: 10;
		font-size: 20px
	}
</style>
