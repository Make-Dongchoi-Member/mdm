<script lang="ts">
	import { modalStatesStore, myData } from "../../../store";
    import { clickOutside, escapeKey } from "../../../actions";

	let nickname: string = "";

	const nicknameClickEvent = () => {
		console.log(nickname);
		nicknameSetAPI({data : {nickname}});
		$myData.nickname = nickname;
		$modalStatesStore.isNicknameModal = false;

		/**
		 * @TODO
		 * 닉네임이 적절한지 확인
		 * 닉네임 변경 API
		*/
	};

	async function nicknameSetAPI(data: any) {
		try {
			const response = await fetch("http://localhost:3000/api/user/set/nickname", {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			return response;
		} catch (error) {
			console.error("실패:", error);
		}
	}
</script>

<div class="modal-container {$modalStatesStore.isNicknameModal ? '' : 'hidden-container'}"
	use:clickOutside on:outclick={() => {$modalStatesStore.isNicknameModal = false}}
	use:escapeKey on:esckey={() => {$modalStatesStore.isNicknameModal = false}}>
	<button class="close-button" on:click={() => {$modalStatesStore.isNicknameModal = false}}>&#215;</button>
	<div class="modal-title">
		NEW NICKNAME
	</div>
	<div class="modal-content">
		<form>
			<input type="text" maxlength="10" placeholder="put your new nickname" bind:value={nickname} required>
			<button on:click={nicknameClickEvent} type="submit"></button>
		</form>
	</div>
</div>

<style>
	.modal-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

		width: 530px;
		height: 150px;
		
		background-color: var(--dark-color);
		border: 1px solid var(--point-color);
		border-radius: 0.5rem;
		
		position: absolute;
		top: 19.5%;
		left: 31%;
	}

	.hidden-container {
		display: none;
	}

	.close-button {
		position: absolute;
		width: 0;
		top: 0px;
		right: 20px;
		border: none;
		border-radius: 70%;
		font-size: 25px;
		font-weight: 300;
		background-color: var(--dark-color);
		outline: none;
	}

	.close-button:active {
		padding-top: 0.2rem;
	}

	.modal-title {
		text-align: center;
	}

	.modal-content {
		display: flex;
		flex-direction: row;
		justify-content: center;

		width: 280px;
	}

	input[type=text] {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--point-color);
		border: 2px solid var(--text-color);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	input:focus {
		outline: none;
		border: 2px solid var(--intra-color);
	}

	input:focus::placeholder {
		color: transparent;
	}

	form {
		position: relative;
	}

	form > button {
		position: absolute;
		top: 12px;
		right: 10px;

		width: 20px;
		height: 20px;
		background-color: var(--text-color);
		border-radius: 70%;
		border-color: var(--point-color);
		margin: 0;
		padding: 0;
	
	}

	form > button:hover {
		background-color: var(--point-color);
		border-radius: 10%;
	}

	form > button:active {
		background-color: red;
	}
</style>
