<script lang="ts">
	import ProfileSocialModal from "./ProfileSocialModal.svelte";
	import ProfileHistoryModal from "./ProfileHistoryModal.svelte";
	import ProfileSocial from "./history/ProfileSocial.svelte";
	import ProfileHistory from "./history/ProfileHistory.svelte";
	import MyInfo from "./history/MyInfo.svelte";
    import ProfileModal from "./ProfileModal.svelte";

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

<!-- <ProfileSocialModal />
<ProfileHistoryModal /> -->
<ProfileModal />

<div class="info_container">
	<MyInfo />
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

<style>
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
