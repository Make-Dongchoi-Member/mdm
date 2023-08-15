<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gameSettingStore, socketStore, myData } from '../../../store';
	import type { GameData, GameRoom, GameStatus } from '../../../interfaces';

	let scoreDiv: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	
	interface Rect {
		w: number;
		h: number;
		x: number;
		y: number;
		color: string;
	}
	
	interface Ball extends Rect {
		speedX: number;
		speedY: number;
	}
	
	interface Bar extends Rect {
		speed: number;
	}

	interface Position {
		x: number,
		y: number,
	}

	interface BallColorRGB {
		red: number,
		green: number,
		blue: number,
	}
	

	interface GameState {
		page: string,
		controlWithMouse: boolean,
		myScore: number,
		enemyScore: number,
		speed: number,
		backgroundColor: string,
		ballColor: BallColorRGB,
		barColor: string,
		basicModeBar: number,
		hardModeBar: number,
	}

	let gameState:GameState = {
		page: "wait",
		controlWithMouse: false,
		myScore: 5,
		enemyScore: 5,
		speed: 2.5,
		backgroundColor: "#424242",
		ballColor: {red: 200, green: 200, blue: 200},
		barColor: $gameSettingStore.barColor,
		basicModeBar: 120,
		hardModeBar: 50,
	}

	let ballColorString: string = `rgb(${gameState.ballColor.red}, \
										${gameState.ballColor.green}, \
										${gameState.ballColor.blue})`

	const ball: Ball = {
		w: 6,
		h: 6,
		x: 0,
		y: 0,
		speedX: 3,
		speedY: 3,
		color: ballColorString,
	}

	let leftBar: Bar = {
		w:7,
		h: gameState.basicModeBar,
		x: 0,
		y: 180,
		speed: 0,
		color: gameState.barColor,
	}

	let rightBar: Bar = {
		w:7,
		h: gameState.basicModeBar,
		x: 793,
		y: 180,
		speed: 0,
		color: gameState.barColor,
	}

	let gameInfo: GameRoom = {
		playerA: '',
		playerB: '',
	};

	let matching: boolean = false;
	let ready: boolean = false;
	let gameHost: boolean = false;

	// 내 목숨도 서버에서 전부 관리하는 것이 더 좋을 듯.
	let leftLife: number = 5;
	let rightLife: number = 5;

	let ballPos: Position[] = new Array();

	const gameReady = () => {
		if (ready) return;
		ready = true;
		$socketStore.emit("game/match", {
			nickname: $myData.nickname,
			gameMode: $gameSettingStore.gameMode,
			barColor: $gameSettingStore.barColor
		});
	}

	const gameStart = () => {
		if (matching) {
			$socketStore.emit("game/start", { nickname: gameInfo.playerA, roomKey: gameInfo.roomKey });
		}
	}

	const handleMousePointer = (event: MouseEvent) => {
		if (gameState.controlWithMouse) {
			const pos = event.movementY;

			$socketStore.emit("game/bar", { nickname: gameInfo.playerA, roomKey: gameInfo.roomKey, pos: pos});
		}
	}

	const mouseControl = () => {
		if (!matching) return ;
		if (gameState.controlWithMouse) {
			gameState.controlWithMouse = false;
			document.exitPointerLock();
		} else {
			gameState.controlWithMouse = true;
			canvas.requestPointerLock();
		}
	}

	onMount(() => {
		scoreDiv = document.getElementById("score") as HTMLDivElement;
		canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
		ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	
		canvas.width = 800;
		canvas.height = 430;

		canvas.addEventListener('click', mouseControl);
		document.addEventListener('mousemove', handleMousePointer);

		$socketStore.on('game/room', (arg: GameRoom) => {
			gameInfo = arg;
			matching = true;
			if (gameInfo.playerA === $myData.nickname) gameHost = true;
		});

		$socketStore.on('game/play', (arg: GameStatus) => {
			ctx.fillStyle = gameState.backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);


			ballPos.push({x: ball.x, y: ball.y});
			if (ballPos.length > 35) {
				ballPos.shift();
			}


			leftBar.y = arg.playerA.bar.y;
			leftBar.h = arg.playerA.bar.h;
			leftBar.color = arg.playerA.bar.color;

			rightBar.y = arg.playerB.bar.y;
			rightBar.h = arg.playerB.bar.h;
			rightBar.color = arg.playerB.bar.color;

			ctx.fillStyle = leftBar.color;
			ctx.fillRect(leftBar.x, leftBar.y, leftBar.w, leftBar.h);
			ctx.fillStyle = rightBar.color;
			ctx.fillRect(rightBar.x, rightBar.y, rightBar.w, rightBar.h);

			ball.x = arg.ball.x;
			ball.y = arg.ball.y;
			for (const i in ballPos) {
				ctx.fillStyle = `rgba(${gameState.ballColor.red}, \
				${gameState.ballColor.green}, \
				${gameState.ballColor.blue}, \
				${0.02 * +i})`;
				ctx.fillRect(ballPos[i].x, ballPos[i].y, ball.w, ball.h);
			}
			ctx.fillStyle = ball.color;
			ctx.fillRect(ball.x, ball.y, ball.w, ball.h);

			leftLife = arg.playerA.life;
			rightLife = arg.playerB.life;
		});

		$socketStore.on('game/end', (arg: GameStatus) => {
			let winner: string;
			if (arg.playerA.life > 0) {
				winner = arg.playerA.nickname;
			} else {
				winner = arg.playerB.nickname;
			}
			const scoreDiv = document.querySelector("#score") as HTMLDivElement;
			if (gameInfo.playerA === winner) {
				// 내가 이김
				scoreDiv.innerText = "WIN";
			} else {
				// 내가 짐
				scoreDiv.innerText = "LOSE";
			}
			ready = false;
			gameHost = false;
		})
	});

	onDestroy(() => {
		$socketStore.off("game/match");
		$socketStore.off("game/play");
		canvas.removeEventListener('click', mouseControl);
		document.removeEventListener('mousemove', handleMousePointer);
	});
</script>

<div class="life">
	{#if matching}
		<span>{gameInfo.playerA} : {leftLife}</span>
		<span>{gameInfo.playerB} : {rightLife}</span>
	{/if}
</div>
<canvas id="game-canvas">Canvas</canvas>
<div id="score"></div>
<div class="button-area">
	<button on:click={gameReady}>{ready ? "✓" : "game ready"}</button>
	{#if gameHost}
		<button on:click={gameStart}>game start</button>
	{/if}
</div>

<style>
	#score {
		display: none;
	}

	.life {
		position: absolute;
		top: 100px;

		display: flex;
		justify-content: space-between;

		width: 800px;

		color: var(--point-color);
	}

	#game-canvas {
		border: 1px solid var(--border-color);
		box-sizing: border-box;
	}

	.button-area> button {
		width: 150px;
	}
</style>

