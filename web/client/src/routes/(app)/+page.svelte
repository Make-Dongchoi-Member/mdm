<script lang="ts">
	import { myData } from '../../store'
	import type { MyData } from '../../interfaces';
	import { goto } from '$app/navigation';
	import GameSetting from './game/GameSetting.svelte';
</script>

<div class="game-box">
	<canvas>

	</canvas>
	<GameSetting />
</div>

<style>
	.game-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		height: 650px;
	}

	canvas {
		border: 1px solid var(--border-color);
		width: 800px;
		height: 430px;
		box-sizing: border-box;
	}
</style>
