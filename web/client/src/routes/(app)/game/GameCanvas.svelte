<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { spaceKey } from '../../../actions';
	import { gameSettingStore, socketStore, myData } from '../../../store';
	import type { GameData, GameInfo, GameStatus } from '../../../interfaces';

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

	let gameInfo: GameInfo = {
		me: $myData.nickname,
		enemy: 'anonymous',
		gameHost: false,		
	};

	let ready: boolean = false;

	let leftLife: number = 5;
	let rightLife: number = 5;
	let leftPlayer: string = '';
	let rightPlayer: string = '';

	let ballPos: Position[] = new Array();

	const gameReady = () => {
		$socketStore.emit("game/match", { nickname: $myData.nickname });
	}

	const gameStart = () => {
		if (ready) {
			$socketStore.emit("game/start", { nickname: gameInfo.me, roomKey: gameInfo.roomKey });
		}
	}

	const handleMousePointer = (event: MouseEvent) => {
		if (gameState.controlWithMouse) {
			const pos = event.movementY;

			$socketStore.emit("game/bar", { nickname: gameInfo.me, roomKey: gameInfo.roomKey, pos: pos});
		}
	}

	const mouseControl = () => {
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

		$socketStore.on('game/match', (arg) => {
			if ($myData.nickname === arg.playerA) {
				gameInfo.gameHost = true;
				gameInfo.enemy = arg.playerB;
			} else {
				gameInfo.enemy = arg.playerA;
			}
			gameInfo.roomKey = arg.roomKey;
			leftPlayer = arg.playerA;
			rightPlayer = arg.playerB;
			ready = true;
		});

		$socketStore.on('game/play', (arg: GameStatus) => {
			ctx.fillStyle = gameState.backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);


			ballPos.push({x: ball.x, y: ball.y});
			if (ballPos.length > 35) {
				ballPos.shift();
			}


			leftBar.y = arg.playerA.bar.y;
			rightBar.y = arg.playerB.bar.y;
			ctx.fillStyle = leftBar.color;
			ctx.fillRect(leftBar.x, leftBar.y, leftBar.w, leftBar.h);
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
	});

	onDestroy(() => {
		$socketStore.off("game/match");
		$socketStore.off("game/play");
		canvas.removeEventListener('click', mouseControl);
		document.removeEventListener('mousemove', handleMousePointer);
	});
</script>

<div class="life">
	<span>{leftPlayer} : {leftLife}</span>
	<span>{rightPlayer} : {rightLife}</span>
</div>
<canvas id="game-canvas">Canvas</canvas>
<div id="score">
	0 : 0
</div>
<div class="button-area">
	<button on:click={gameReady}>game ready</button>
	<button on:click={gameStart}>game start</button>
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
</style>

