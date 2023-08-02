<script lang="ts">
	import { modalStatesStore } from "../../../store";
    import ModalSocial from "./ModalSocial.svelte";
	import ProfileHistory from "./ProfileHistory.svelte";
	import OtherInfo from "./OtherInfo.svelte";
    import { clickOutside, escapeKey } from "../../../actions";

	interface tabButtons {
		[index: string]: boolean;
		social: boolean;
		history: boolean;
	}

	let tabButtonSet: tabButtons = {
		social: true,
		history: false,
	};

	const modalCloseEvent = () => {
		$modalStatesStore.isProfileModal = false;
		for (const key of Object.keys(tabButtonSet)) {
			tabButtonSet[key] = false;
		}
		tabButtonSet.social = true;
	}

	const profileTabEvent = (e: any) => {
		for (const key of Object.keys(tabButtonSet)) {
			tabButtonSet[key] = false;
		}
		tabButtonSet[e.target.value] = true;
	}
</script>

<div class="modal-frame"
	style="{$modalStatesStore.isProfileModal ? 'display: flex;' : 'display: none;'}"
	use:clickOutside on:outclick={ modalCloseEvent }
	use:escapeKey on:esckey={ modalCloseEvent }>
	<button class="close-button" on:click={ modalCloseEvent }>&#215;</button>
	<div class="modal-container">
		<div class="info_container">
			<OtherInfo />
		</div>
		<div class="data_container">
			<div class="button_area">
				<button on:click={ profileTabEvent }
					value="social"
					class={tabButtonSet.social ? "selected" : ""}>SOCIAL</button>
				<button on:click={ profileTabEvent }
					value="history"
					class={tabButtonSet.history ? "selected" : ""}>HISTORY</button>
			</div>
			{#if tabButtonSet.social}
				<ModalSocial />
			{:else if tabButtonSet.history}
				<ProfileHistory />
			{/if}
		</div>
	</div>
</div>

<style>
	.close-button {
		position: absolute;
		width: 0;
		top: 0px;
		right: 3px;
		border: none;
		border-radius: 70%;
		font-size: 25px;
		font-weight: 300;
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
		border-radius: 0.5rem;
		box-sizing: border-box;

		position: absolute;

		margin-top: -70px;
		margin-left: -30px;
	}

	.modal-container {
		width: 800px;
		height: 650px;
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

	button {
		width: 150px;
		margin-right: 15px;
	}

	.selected {
		border: 1px solid var(--point-color);
		background-color: var(--hover-color);
	}
</style>
