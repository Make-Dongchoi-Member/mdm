<script lang="ts">
    import { onMount } from 'svelte'
    import { gameSettingStore, myData } from '../../store'
    import type { MyData } from '../../interfaces';
    import { goto } from '$app/navigation';

    let barColor: string = "#ff6231";
    let isColorOptionShow: boolean = false;
    let isShapeOptionShow: boolean = false;

    onMount(() => {

        const gameModeDiv = document.querySelector(".game-mode") as HTMLDivElement;
        for (const child of gameModeDiv.children) {
            if (child.tagName === "BUTTON") {
                child.addEventListener("mouseover", (e: any) => {
                    if (e.target.value !== $gameSettingStore.gameMode) {
                        e.target.style.backgroundColor = "var(--hover-color)";
                    }
                });
                child.addEventListener("mouseout", (e: any) => {
                    if (e.target.value !== $gameSettingStore.gameMode) {
                        e.target.style.backgroundColor = "var(--bg-color)";
                    }
                });
            }
        }
        
    });

    const colorButtonEvent = () => {
        isColorOptionShow = !isColorOptionShow;
        isShapeOptionShow = false;
    }

    const shapeButtonEvent = () => {
        isShapeOptionShow = !isShapeOptionShow;
        isColorOptionShow = false;
    }

    const gameModeEvent = (e: any) => {
        $gameSettingStore.gameMode = e.target.value;

        for (const child of e.target.parentNode.children) {
            if (child.tagName === "BUTTON") {
                child.style.backgroundColor = "var(--bg-color)";
                child.style.border = "1px solid var(--border-color)";
            }
        }
        e.target.style.backgroundColor = "var(--hover-color)";
        e.target.style.border = "1px solid var(--point-color)";
    }

    const barColorEvent = (e: any) => {
        $gameSettingStore.barColor = e.target.value;
    }

    const ballShapeEvent = (e: any) => {
        $gameSettingStore.ballShape = e.target.value;
    }

</script>

<div class="game-box">
	<canvas>

	</canvas>
	<div class="game-setting">
		<div class="game-mode">
			<div>GAME MODE</div>
			<button value="basic" on:click={gameModeEvent}>BASIC</button>
			<button value="hard" on:click={gameModeEvent}>HARD</button>
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
</div>

<style>
	.game-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		height: 650px;
	}

	.color-option {
		position: relative;
	}

	.color-option > button, .shape-option > button, .game-mode > button {
		width:340px;
		height: 40px;
	}
		
	.game-mode > div, .skin-option > div, .game-mode > button {
		margin-bottom: 15px;
	}

	button:hover {
		background-color: var(--hover-color);
	}

	.color-option > div > button:hover {
		background-color: var(--hover-color);
	}

	.shape-option > div > button:hover {
		background-color: var(--hover-color);
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

	.color-option > div > button, .shape-option > div > button {
		margin-top: 5px;
		outline: none;
		border: 1px solid var(--border-color);
		background-color: var(--bg-color);
		color: var(--text-color);
	}

	.shape-option {
		position: relative;
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

	canvas {
		border: 1px solid var(--border-color);
		width: 800px;
		height: 430px;
		box-sizing: border-box;
	}
</style>
