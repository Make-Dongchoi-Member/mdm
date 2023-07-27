<script lang="ts">
	import { modalStatesStore } from "../../../store";
    import OtherInfo from "./history/OtherInfo.svelte";

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

	const ModalCloseEvent = () => {
		$modalStatesStore.isProfileHistoryModal = false;
		$modalStatesStore.isProfileSocialModal = false;
	}

	const SocialModalEvent = () => {
		$modalStatesStore.isProfileSocialModal = true;
		$modalStatesStore.isProfileHistoryModal = false;
	}

	const HistoryModalEvent = () => {
		$modalStatesStore.isProfileSocialModal = false;
		$modalStatesStore.isProfileHistoryModal = true;
	}
</script>

<div class="modal-frame {$modalStatesStore.isProfileSocialModal ? "flex-frame" : "hidden-frame"}">
	<button class="close-button" on:click={ ModalCloseEvent }>&#215;</button>
	<div class="modal-container">
		<div class="info_container">
			<OtherInfo />
		</div>
		<div class="data_container">
			<div class="button_area">
				<nav>
					<a on:click={ SocialModalEvent }>SOCIAL</a>
					<a on:click={ HistoryModalEvent }>HISTORY</a>
				</nav>
			</div>
			<div class="data">
				{#each members as item}
				<div>
					<img src={item.avatarSrc} alt="profile_image">
					<div>
						{item.id}
					</div>
				</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.close-button {
		position: absolute;
		top: 1px;
		right: 1px;
		border: none;
		font-size: 25px;
		font-weight: 500;
		background: none;
		outline: none;
	}

	.modal-frame {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 860px;
		height: 710px;

		background-color: var(--bg-color);
		border: 1px solid var(--point-color);
		box-sizing: border-box;

		position: absolute;

		margin-top: -70px;
		margin-left: -30px;
	}

	.hidden-frame {
		display: none;
	}

	.modal-container {
		width: 800px;
		height: 650px;
	}

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
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
		width: 775px;
		height: 300px;

		overflow-y: auto;

		margin: 10px 10px 10px 15px;
	}

	.data > div {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		height: 60px;
		width: 370px;
		margin-right: 10px;
		margin-bottom: 10px;
		outline: none;
		border: 1px solid var(--border-color);
		background-color: var(--bg-color);
		color: var(--text-color);
	}

	.data > div > :nth-child(1) {
		display: flex;

		border-radius: 70%;
		width: 40px;
		height: 40px;
		margin-left: 20px;
		margin-right: 30px;
	}

	.data > div > :nth-child(2) {
		flex-grow: 10;
		font-size: 20px
	}

	.info_container {
		display: flex;
		flex-direction: row;
		border: 1px solid var(--border-color);
		height: 250px;
	}

	.data_container {
		border: 1px solid var(--border-color);
		height: 380px;
		margin-top: 20px;
	}

	.button_area {
		display: flex;
		flex-direction: row;
		width: 750px;
		height: 30px;
		margin: 20px 10px 10px 15px;
	}

	nav {
		display: flex;
	}

	nav > a {
		width: 150px;
		border: 1px solid var(--border-color);
		text-align: center;
		color: var(--text-color);
		background-color: var(--bg-color);
		padding-top: 5px;
		text-decoration: none;
		margin-right: 15px;
	}

	nav > a:hover {
		background-color: var(--hover-color);
	}
</style>
