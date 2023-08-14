<script lang="ts">
  import { dm } from "../../../store";
  import DirectMessage from "./DirectMessage.svelte";
  import Friends from "./Friends.svelte";


</script>

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
