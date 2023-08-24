<script lang="ts">
  import DirectMessage from "./DirectMessage.svelte";
  import Friends from "./Friends.svelte";
  import ProfileModal from "../(profileModal)/ProfileModal.svelte";
  import { apiUrl, modalStatesStore, myData } from "../../../store";
	import FindModal from "./FindModal.svelte";
  import { onMount } from "svelte";
  import type { MyData } from "../../../interfaces";

	onMount(() => {
		getMyData();
	});

	const getMyData = async (): Promise<void> => {
		try {
			const response = await fetch(`${apiUrl}/api/user/me`, {
				method: "GET",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data: Promise<MyData> = response.json();
			$myData = await data;
		} catch (error) {
			console.error("실패:", error);
		}
	}
</script>

{#if $modalStatesStore.isProfileModal}
	<ProfileModal />
{/if}
{#if $modalStatesStore.isFindModal}
	<FindModal />
{/if}
<div class="chat-box">  
	<Friends />
	<DirectMessage />
</div>

<style>
	.chat-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
