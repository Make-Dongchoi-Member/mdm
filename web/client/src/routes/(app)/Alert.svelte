<script lang="ts">
  import type { AlertData } from "../../interfaces";
  import { AlertType } from "../../enums";
  import { goto } from "$app/navigation";
  import { apiUrl, gameSettingStore, modalStatesStore, myData, socketStore } from "../../store";

	export let alertData: AlertData;
	export let getAlertList: Function;
	
	const acceptButtonClickEvent = () => {
		if (alertData.alertType === AlertType.CHAT_INVITE) {
			postChatAlertAccept();
		} else if (alertData.alertType === AlertType.FRIEND_REQUEST) {
			postFollowAlertAccept();
		} else if (alertData.alertType === AlertType.GAME_REQUEST) {
			postGameAlertAccept();
		}
	}

	const postFollowAlertAccept = async (): Promise<void> => {
		try {
			const response = await fetch(`${apiUrl}/api/alert/follow/accept`, {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: { alert: alertData } })
			})
			.then(() => {
				getAlertList();
			});
		} catch (error) {
			console.error("실패:", error);
		}
	}

	const postChatAlertAccept = async (): Promise<void> => {
		try {
			const response = await fetch(`${apiUrl}/api/alert/chat/accept`, {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: { alert: alertData } })
			})
			.then(() => {
				getAlertList();
				$modalStatesStore.isNotiModal = false;
				goto(`/chat/room?id=${alertData.roomId}`);
				$socketStore.emit("chat/enter", { roomId: `${alertData.roomId}`, userId: `${$myData.id}` });
			});
		} catch (error) {
			console.error("실패:", error);
		}
	}

	const postGameAlertAccept = async (): Promise<void> => {
		try {
			const response = await fetch(`${apiUrl}/api/alert/game/accept`, {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: { alert: alertData } })
			})
			.then((response) => response.json())
			.then((response) => {
				if (response) {
					alertData.gameSetting = $gameSettingStore;
					$socketStore.emit("game/private-match", { alert: alertData });
					goto(`/?key=${alertData.roomId}`);
				} else {
					alert('room not found');
				}
				$modalStatesStore.isNotiModal = false;
				getAlertList();
			});
		} catch (error) {
			console.error("실패:", error);
		}
	}

	const postAlertDeny = async (): Promise<void> => {
		if (alertData === undefined) return;
		try {
			const response = await fetch(`${apiUrl}/api/alert/deny`, {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: { alert: alertData } })
			})
			.then(() => {
				if (alertData.alertType === AlertType.GAME_REQUEST) {
					$socketStore.emit("game/private-match-deny", { alert: alertData });
				}
				getAlertList();
			});
		} catch (error) {
			console.error("실패:", error);
		}
	}
</script>

{#if alertData}
<div class="modal-content">
	{#if alertData.alertType === AlertType.CHAT_INVITE}
	<div>GO TO CHATTING ROOM</div>
	{:else if alertData.alertType === AlertType.FRIEND_REQUEST}
	<div>GET RELATIONSHIP</div>
	{:else if alertData.alertType === AlertType.GAME_REQUEST}
	<div>GO TO MATCH</div>
	{/if}
	<div>
		<span class="simple-text">with</span>
		<span>{alertData.sender.nickname}</span>
	</div>
	<div class="button-area">
		<button class="yes-button" on:click={acceptButtonClickEvent}>&#x2713;</button>
		<button class="no-button" on:click={postAlertDeny}>&#x2715;</button>
	</div>
</div>	
{/if}

<style>

.modal-content {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;

		position: relative;
		
		width: 96%;
		height: 40px;

		border: 1px solid var(--border-color);
		margin-left: 2%;
		margin-bottom: 10px;
	}
		
	.modal-content > :nth-child(1) {
		position: absolute;
		font-size: 13px;
		margin-left: 10px;

		left: 10px;
	}
		
	.modal-content > :nth-child(2) {
		display: flex;
		flex-direction: row;
		align-items: end;
		text-align: right;
		font-size: 12px;
	}
		
	.simple-text {
		color: var(--border-color);
		font-size: 10px;
		padding-right: 5px;
		padding-bottom: 2px;
	}

	.button-area {
		display: flex;
		text-align: center;
		margin-left: 10px;
	}

	.yes-button {
		background-color: var(--dark-color);
		color: var(--point-color);
		border: none;

		font-size: 21px;
		font-weight: 400;
	}

	.yes-button:active {
		padding-top: 0.2rem;
	}

	.no-button {
		background-color: var(--dark-color);
		color: var(--text-color);
		border: none;
		margin-right: 10px;
	}

	.no-button:active {
		padding-top: 0.2rem;
	}
</style>
