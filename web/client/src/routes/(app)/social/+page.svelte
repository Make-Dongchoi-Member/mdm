<script lang="ts">
  import DirectMessage from "./DirectMessage.svelte";
  import Friends from "./Friends.svelte";
  import ProfileModal from "../(profileModal)/ProfileModal.svelte";
  import { modalStatesStore } from "../../../store";
	import FindModal from "./FindModal.svelte";
</script>

{#if $modalStatesStore.isProfileModal}
	<ProfileModal />
{/if}
<FindModal />
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
