<script lang="ts">
	import { modalStatesStore } from "../../store";
	import type { AlertData, AlertListDTO, Notification } from "../../interfaces";
	import { clickOutside, escapeKey } from "../../actions";
  import { onMount } from "svelte";
  import Alert from "./Alert.svelte";

	let alerts: AlertData[] = [];

	onMount(() => {
		getAlertList();
	});

	const getAlertList = async (): Promise<void> => {
		try {
			const response = await fetch("http://localhost:3000/api/alert/list", {
				method: "GET",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => response.json())
			.then((data: AlertListDTO) => {
				alerts = data.alerts;
			});
		} catch (error) {
			console.error("실패:", error);
		}
	}

	const modalCloseEvent = () => {
		$modalStatesStore.isNotiModal = false;
	}
</script>

<div class="modal-container"
	use:clickOutside on:outclick={modalCloseEvent}
	use:escapeKey on:esckey={modalCloseEvent}>
	<div class="modal-box">
		<div class="modal-title">
			<div>
				NOTIFICATION
			</div>
			<div class="alarm">
				<button on:click={modalCloseEvent}>
					&#x1F4E2;
				</button>
			</div>
		</div>
		<div class="modal-content-box">
			{#each alerts as a}
				<Alert alertData={a} {getAlertList} />
			{/each}
		</div>
	</div>
</div>

<style>
	.modal-container {
		width: 880px;

		border: 1px solid transparent;
		box-sizing: border-box;

		position: absolute;
		z-index: 2;

		margin-top: 130px;
	}

	.modal-box {
		width: 480px;
		display: flex;
		flex-direction: column;

		background-color: var(--dark-color);
		border: 1px solid var(--point-color);
		border-radius: 0.5rem;

		box-sizing: border-box;
		
		position: absolute;
		top: 8px;
		margin-left: 400px;
	}

	.modal-title {
		color: var(--point-color);
		display:flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 15px;
		margin-bottom: 5px;
	}

	.modal-title > :nth-child(1) {
		margin-top: 5px;
	}
		
	.alarm > button {
		width: 30px;
		background-color: var(--dark-color);
		text-align: center;
		border: none;
		border-radius: 70%;
	}

	.modal-content-box {
		display: flex;
		flex-direction: column-reverse;
		max-height: 350px;
		overflow-y: scroll;
		margin-right: 5px;
		margin-bottom: 15px;
	}

	.modal-content-box::-webkit-scrollbar {
		width: 5px;
	}

	.modal-content-box::-webkit-scrollbar-track {
		background-color: var(--bg-color);
	}

	.modal-content-box::-webkit-scrollbar-thumb {
		background-color: var(--border-color);
		border-radius: 4px;
	}

	.modal-content-box::-webkit-scrollbar-thumb:hover {
		background-color: var(--text-color);
	}
</style>
