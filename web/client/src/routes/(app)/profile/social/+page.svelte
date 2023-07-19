<script lang="ts">
	interface Profile {
		id: string;
		avatarSrc: string;
	}

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

<div class="info_box">
		<div class="profile_image_circle">
		</div>
		<div class="personal_info">
			<button>
				nickname
			</button>
			<button>
				LOGOUT
			</button>
		</div>
	</div>
	<div class="data_box">
		<div class="button_area">
			<nav>
				<a href="/profile">HISTORY</a>
				<a href="/profile/social">SOCIAL</a>
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

<style>
	/* scroll bar */

	.data {
		height: 300px;
		overflow-y: auto;
		overflow-x: hidden;
	}

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
		/* border: 1px solid white; */
		width: 775px;
		/* height: 300px; */
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
		padding-right: 10px;
		font-size: 20px
	}

	.info_box {
		border: 1px solid var(--border-color);
		height: 250px;
	}

	.profile_image_circle {
		border: 1px solid var(--border-color);
		border-radius: 50%;
		width: 100px;
		height: 100px;
		margin: 30px 20px 20px 40px;
	}

	.personal_info {
		width: 150px;
		height: 80px;
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		margin-left: 15px;
	}

	.personal_info > button {
		width: 150px;
		/* height: 30px; */
		/* border: 1px solid var(--border-color); */
		/* background-color: var(--bg-color); */
		/* color: var(--text-color); */
		/* text-align: center; */
		margin-bottom: 10px;
	}

	.data_box {
		border: 1px solid var(--border-color);
		height: 380px;
		margin-top: 20px;
	}

	.button_area {
		display: flex;
		flex-direction: row;
		/*border: 1px solid black;*/
		width: 750px;
		height: 30px;
		margin: 20px 10px 10px 15px;
	}

	nav {
		display: flex;
		/* align-items: center; */
	}

	nav > a {
		width: 150px;
		/* height: 30px; */
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
