<script lang="ts">
	import { goto } from "$app/navigation";
	import { modalStatesStore, myData } from "../../../store";
    import { clickOutside, escapeKey } from "../../../actions";

	const outButtonEvent = () => {
		/*
			@TODO
			LOGOUT 했다는 API 요청
		*/
		
		deleteToken('access_token');
		goto("/signin");
		$modalStatesStore.isLogoutModal = false;
	}

	const deleteToken = (name: string) => {
		document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
	}
</script>

<div class="modal-container"
	style="{$modalStatesStore.isLogoutModal ? 'display: flex;' : 'display: none;'}"
	use:clickOutside on:outclick={() => {$modalStatesStore.isLogoutModal = false}}
	use:escapeKey on:esckey={() => {$modalStatesStore.isLogoutModal = false}}>
	<div class="modal-title">
		ARE YOU SURE?
	</div>
	<div class="modal-content">
		<button on:click={outButtonEvent} class="yes-button">YES</button>
		<button on:click={() => { $modalStatesStore.isLogoutModal = false; }} class="no-button">NO</button>
	</div>
</div>

<style>
	.modal-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

		width: 690px;
		height: 150px;
		
		background-color: var(--dark-color);
		border: 1px solid var(--point-color);
		border-radius: 0.5rem;
		
		position: absolute;

		margin-top: 220px;
		margin-left: 55px;
	}

	.modal-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		width: 280px;
	}

	button {
		width: 120px;
		height: 35px;
		background-color: var(--dark-color);
	}

	button:hover {
		background-color: var(--hover-color);
	}
</style>
