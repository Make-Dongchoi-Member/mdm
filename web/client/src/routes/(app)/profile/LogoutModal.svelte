<script lang="ts">
	import { goto } from "$app/navigation";
	import { modalStatesStore, myData } from "../../../store";
    import { clickOutside, escapeKey } from "../../../actions";

	const outButtonEvent = () => {
		/*
			@TODO
			LOGOUT 했다는 API 요청
		*/
		
		deleteToken();
		goto("/signin");
		$modalStatesStore.isLogoutModal = false;
	}

	const deleteToken = () => {
		//delete the token
	}
</script>

<div class="modal-container {$modalStatesStore.isLogoutModal ? '' : 'hidden-container'}"
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
		top: 26%;
		left: 25%;
	}

	.hidden-container {
		display: none;
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
