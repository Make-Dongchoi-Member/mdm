<script lang="ts">
	import { modalStatesStore, myData } from "../../../store";
    import { clickOutside, escapeKey } from "../../../actions";
    import { goto } from "$app/navigation";

	let isInvalidNickname: boolean = false;
	let block: boolean = false;
	let nickname: string = "";
	let changing: boolean = false;

	const focusEvent = () => {
		isInvalidNickname = false;
	}

	const nicknameClickEvent = () => {
		console.log(nickname);
		block = true;
		changing = true;
		nicknameSetAPI({data : {nickname}})
		.then((res) => {
			setTimeout(() => {
				if (res) {
					const status = res.status;
					if (status === 201) {
						$modalStatesStore.isNicknameModal = false;
						$myData.nickname = nickname;
						block = false;
					} else {
						isInvalidNickname = true;
						block = false;
					}
				}
				changing = false;
			}, 1000)
		});
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

	const modalCloseEvent = () => {
		if (!changing) {
			$modalStatesStore.isNicknameModal = false
			nickname = "";
			block = false;
			isInvalidNickname = false;
		}
	}
</script>

<div class="modal-container"
	style="{$modalStatesStore.isNicknameModal ? 'display: flex;' : 'display: none;'}"
	use:clickOutside on:outclick={modalCloseEvent}
	use:escapeKey on:esckey={modalCloseEvent}>
	<button class="close-button" on:click={modalCloseEvent}>&#215;</button>
	<div class="modal-title">
		NEW NICKNAME
	</div>
	<div class="modal-content">
		<form>
			<input type="text"
			maxlength="10"
			placeholder="put your new nickname"
			bind:value={nickname}
			on:focus={focusEvent}
			class={isInvalidNickname ? "invalid" : "valid"}
			disabled={block ? true : false}
			required>
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
		
		margin-top: 130px;
		margin-left: 135px;
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

	.valid {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--intra-color);
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

	.invalid {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--intra-color);
		border: 2px solid rgb(200, 0, 0);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	input[type=text]:disabled {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--border-color);
		caret-color: var(--border-color);
		border: 2px solid var(--border-color);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
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
