<script lang="ts">
	import ProfileSocial from "./ProfileSocial.svelte";
	import ProfileHistory from "./ProfileHistory.svelte";
	import ProfileModal from "./ProfileModal.svelte";
	import MyInfo from "./MyInfo.svelte";
    import LogoutModal from "./LogoutModal.svelte";
	
	interface subComponents {
		[index: string]: boolean;
		social: boolean;
		history: boolean;
	}
	
	let components: subComponents = {
		social: true,
		history: false,
	};

	const profileTabEvent = (e: any) => {
		for (const key of Object.keys(components)) {
			components[key] = false;
		}
		components[e.target.value] = true;
	}
</script>

<ProfileModal />
<LogoutModal />

<div class="info_container">
	<MyInfo />
</div>
<div class="data_container">
	<div class="button_area">
		<button on:click={ profileTabEvent }
			value="social"
			class={components.social ? "selected" : ""}>SOCIAL</button>
		<button on:click={ profileTabEvent }
			value="history"
			class={components.history ? "selected" : ""}>HISTORY</button>
	</div>
	{#if components.social}
		<ProfileSocial />
	{:else if components.history}
		<ProfileHistory />
	{/if}
</div>

<style>
	.info_container {
		display: flex;
		flex-direction: row;
		border: 1px solid var(--border-color);
		height: 250px;
		box-sizing: border-box;
	}

	.data_container {
		border: 1px solid var(--border-color);
		height: 380px;
		margin-top: 20px;
		box-sizing: border-box;
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
