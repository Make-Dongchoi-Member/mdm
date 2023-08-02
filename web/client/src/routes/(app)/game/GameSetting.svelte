<script lang="ts">
	import { onMount } from 'svelte'
	import { gameSettingStore } from '../../../store'

	let isColorOptionShow: boolean = false;
	let isShapeOptionShow: boolean = false;

	let isColorOptionSelected: boolean = false;
	let isShapeOptionSelected: boolean = false;

	interface gameMode {
		[index: string]: boolean;
		basic: boolean;
		hard: boolean;
	}

	let mode: gameMode = {
		basic: true,
		hard: false,
	}

	const gameModeSetEvent = (e: any) => {
		for (const key of Object.keys(mode)) {
			mode[key] = false;
		}
		mode[e.target.value] = true;
		$gameSettingStore.gameMode = e.target.value;
	}

	const colorButtonEvent = () => {
		isColorOptionShow = !isColorOptionShow;
		isShapeOptionShow = false;
	}

	const shapeButtonEvent = () => {
		isShapeOptionShow = !isShapeOptionShow;
		isColorOptionShow = false;
	}

	const barColorEvent = (e: any) => {
		$gameSettingStore.barColor = e.target.value;
	}

	const ballShapeEvent = (e: any) => {
		$gameSettingStore.ballShape = e.target.value;
	}
</script>

<div class="game-setting">
	<div class="game-mode">
		<div>GAME MODE</div>
		<button value="basic"
			class={mode.basic ? "selected" : ""}
			on:click={ gameModeSetEvent }>BASIC</button>
		<button value="hard"
			class={mode.hard ? "selected" : ""}
			on:click={ gameModeSetEvent }>HARD</button>
	</div>
	<div class="skin-option">
		<div>SKIN OPTION</div>
		<div class="color-option">
			<button on:click={colorButtonEvent}>
				COLOR
			</button>
			<div style="display: {isColorOptionShow ? "flex" : "none"}">
				<button value="#ff6231" on:click={barColorEvent}>
					Royal Orange
				</button>
				<button value="#00BABC" on:click={barColorEvent}>
					Turquoise Blue
				</button>
				<button value="custom" on:click={barColorEvent}>
					Custom
				</button>
			</div>
		</div>
		<div class="shape-option">
			<button on:click={shapeButtonEvent}>
				SHAPE
			</button>
			<div style="display: {isShapeOptionShow ? "flex" : "none"}">
				<button value="square" on:click={ballShapeEvent}>
					Square
				</button>
				<button value="diamond" on:click={ballShapeEvent}>
					Diamond
				</button>
				<button value="circle" on:click={ballShapeEvent}>
					Circle
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.game-setting {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		border: 1px solid var(--border-color);
		padding: 30px 20px 20px 20px;
	}

	.game-mode {
		display: flex;
		width: 45%;
		flex-direction: column;
		align-content: center;
		text-align: center;
	}

	.skin-option {
		display: flex;
		flex-direction: column;
		width: 45%;
		text-align: center;
	}

	.skin-option > div {
		position: relative;
	}

	.skin-option > div > button, .game-mode > button {
		width:340px;
		height: 40px;
	}

	.game-mode > div, .skin-option > div, .game-mode > button {
		margin-bottom: 15px;
	}

	.color-option > div {
		position: absolute;
		width:340px;
		top: 40px;
		left: 0px;
		display: none;
		flex-direction: column;
		z-index: 1;
		background-color: var(--bg-color);
	}

	.shape-option > div {
		position: absolute;
		width:340px;
		top: 40px;
		left: 0px;
		display: none;
		flex-direction: column;
		z-index: 1;
		background-color: var(--bg-color);
	}

	.skin-option > div > div > button {
		margin-top: 5px;
	}

	.selected {
		border: 1px solid var(--point-color);
		background-color: var(--hover-color);
	}
</style>
