<script lang="ts">
	import { modalStatesStore } from "../../../store";
	import ProfileSocial from "./history/ProfileSocial.svelte";
	import ProfileHistory from "./history/ProfileHistory.svelte";
	import OtherInfo from "./history/OtherInfo.svelte";

	interface tabButtons {
		[index: string]: boolean;
		social: boolean;
		history: boolean;
	}

	let tabButtonSet: tabButtons = {
		social: true,
		history: false,
	};

	const profileTabEvent = (e: any) => {
		for (const key of Object.keys(tabButtonSet)) {
			tabButtonSet[key] = false;
		}
		tabButtonSet[e.target.value] = true;
	}
</script>

<div class="modal-frame" style="{$modalStatesStore.isProfileModal ? 'display: flex;' : 'display: none;'}">
	<button class="close-button" on:click={ () => $modalStatesStore.isProfileModal = false }>&#215;</button>
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
				<ProfileSocial />
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
		top: 1px;
		right: 2px;
		border: none;
		font-size: 25px;
		font-weight: 500;
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
