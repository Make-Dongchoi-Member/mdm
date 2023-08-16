<script lang="ts">
  import type { AlertData, AlertListDTO } from "../../interfaces";
	import { AlertType } from "../../enums";

	export let alert: AlertData;
	export let getAlertList: Function;
	
	const postAlertAccept = async (): Promise<void> => {
		if (alert === undefined) return;
		let alertType: string = "follow";
		if (alert.alertType === AlertType.CHAT_INVITE) {
			alertType = "chat";
		} else if (alert.alertType === AlertType.GAME_REQUEST) {
			alertType = "game";
		}
		try {
			const response = await fetch(`http://localhost:3000/api/alert/${alertType}/accept`, {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: { alert } })
			})
			.then(() => getAlertList());
		} catch (error) {
			console.error("실패:", error);
		}
	}

	const postAlertDeny = async (): Promise<void> => {
		if (alert === undefined) return;
		try {
			const response = await fetch(`http://localhost:3000/api/alert/deny`, {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: { alert } })
			})
			.then(() => getAlertList());
		} catch (error) {
			console.error("실패:", error);
		}
	}
</script>

{#if alert}
<div class="modal-content">
	{#if alert.alertType === AlertType.CHAT_INVITE}
	<div>GO TO CHATTING ROOM</div>
	{:else if alert.alertType === AlertType.FRIEND_REQUEST}
	<div>GET RELATIONSHIP</div>
	{:else if alert.alertType === AlertType.GAME_REQUEST}
	<div>GO TO MATCH</div>
	{/if}
	<div>
		<span class="simple-text">with</span>
		<span>{alert.sender.nickname}</span>
	</div>
	<div class="button-area">
		<button class="yes-button" value={alert.alertType} on:click={postAlertAccept}>&#x2713;</button>
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
