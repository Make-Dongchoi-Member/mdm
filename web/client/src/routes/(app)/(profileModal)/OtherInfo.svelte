<script lang="ts">
	import MatchStat from "./MatchStat.svelte";
	import { myData, profileModalStore, socketStore } from "../../../store";
  import type { AlertData, OtherUserData } from "../../../interfaces";
  import { AlertType } from "../../../enums";

	export let user: OtherUserData;

	const sendFollow = async () => {
		/**
		 * @TODO
		 * follow 요청 보내기
		 */
		const data: AlertData = {
			sender: $myData,
			receiver: user,
			alertType: AlertType.FRIEND_REQUEST,
		}
		$socketStore.emit("alert/follow", data);
	}

	const sendGame = async () => {
		/**
		 * @TODO
		 * 수정하세요
		 */
		const response = fetch(`http://localhost:3000/api/user/game?nickname=${user.nickname}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
        })
		.then((response) => {
			
		})
	}
</script>

<div class="personal_box">
	<button type="button" class="profile_image_circle" disabled>
		<img class="image" src={user.avatar} alt="profile_image">
	</button>
	<div class="personal_info">
		<button disabled>
			{user ? user.nickname : ""}
		</button>
		<button disabled>
			{user ? user.state?.toUpperCase() : ""}
		</button>
	</div>
</div>
<div class="stat_box">
	<MatchStat records={user.record}/>
</div>
<div class="option_box">
	<button on:click={sendFollow}>
		FOLLOW
	</button>
	<button on:click={sendGame}>
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
