<script lang="ts">
	import { myData } from '../../store'
	import type { MyData } from '../../interfaces';
	import { goto } from '$app/navigation';
	import GameSetting from './game/GameSetting.svelte';
    import GameCanvas from './game/GameCanvas.svelte';
</script>

<div class="game-box">
	<GameCanvas />
	<GameSetting />
</div>

<style>
	.game-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		height: 650px;
	}
</style>
