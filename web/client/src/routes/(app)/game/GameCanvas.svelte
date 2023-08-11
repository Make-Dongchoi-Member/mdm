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
		pause: boolean,
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
		pause: false,
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

	let bar: Bar = {
		w: 7,
		h: gameState.basicModeBar,
		x: 10,
		y: 180,
		speed: 0,
		color: gameState.barColor,
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

	let ballPos: Position[] = new Array();

	const mouseControl = () => {
		if (gameState.controlWithMouse) {
			gameState.controlWithMouse = false;
			gameState.pause = true;
			document.exitPointerLock();
		} else {
			gameState.controlWithMouse = true;
			gameState.pause = false;
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

		// $socketStore.on("game", (arg: GameData) => {
		// 	bar = {
		// 	w: 7,
		// 	h: gameState.basicModeBar,
		// 	x: 10,
		// 	y: arg.bar.y,
		// 	speed: 0,
		// 	color: gameState.barColor,
		// 	}
		// });

		$socketStore.on('game/match', (arg) => {
			if ($myData.nickname === arg.playerA) {
				gameInfo.gameHost = true;
				gameInfo.enemy = arg.playerB;
			} else {
				gameInfo.enemy = arg.playerA;
			}
			gameInfo.roomKey = arg.roomKey;
			ready = true;
		});

		$socketStore.on('game/play', (arg: GameStatus) => {
			ctx.fillStyle = gameState.backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			leftBar.y = arg.playerA.bar.y;
			rightBar.y = arg.playerB.bar.y;
			ctx.fillStyle = leftBar.color;
			ctx.fillRect(leftBar.x, leftBar.y, leftBar.w, leftBar.h);
			ctx.fillRect(rightBar.x, rightBar.y, rightBar.w, rightBar.h);

			ball.x = arg.ball.x;
			ball.y = arg.ball.y;
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

	// const waitPage = () => {
	// 	ctx.fillStyle = gameState.backgroundColor;
	// 	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// 	bar.h = ($gameSettingStore.gameMode === "hard") ?
	// 				gameState.hardModeBar : gameState.basicModeBar;
	// 	bar.y = (canvas.height - bar.h) / 2;
	// 	ctx.fillStyle = bar.color;
	// 	ctx.fillRect(bar.x, bar.y, bar.w, bar.h);

	// 	ctx.fillStyle = ballColorString;
	// 	ctx.font = "bold 50px Arial, sans-serif";
	// 	ctx.textAlign = "center";
	// 	ctx.fillText(`${ gameState.myScore } : ${ gameState.enemyScore }`,
	// 					canvas.width / 2, canvas.height / 2);
	// }

	// const gamePage = () => {
	// 	// 게임 진행 페이지
	// }


	const draw = () => {
		if (gameState.pause) {
			waitPage();
			return;
		}

		bar.h = ($gameSettingStore.gameMode === "hard") ?
					gameState.hardModeBar : gameState.basicModeBar;

		ballPos.push({x: ball.x, y: ball.y});
		if (ballPos.length > 35) {
			ballPos.shift();
		}

		ctx.fillStyle = gameState.backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		bar.y += bar.speed;
		if (bar.y < 0) {
			bar.y = 0;
		} else if (bar.y + bar.h > canvas.height) {
			bar.y = canvas.height - bar.h;
		}
		ctx.fillStyle = bar.color;
		ctx.fillRect(bar.x, bar.y, bar.w, bar.h);

		ball.x += ball.speedX;
		ball.y += ball.speedY;
		
		if (ball.x > canvas.width - ball.w) {
			ball.speedX = randomSpeed() * -1;
			if (ball.speedY < 0) {
				ball.speedY = randomSpeed() * -1;
			} else {
				ball.speedY = randomSpeed();
			}
		}
		if (ball.y < 0 || ball.y > canvas.height - ball.h) {
			ball.speedY *= -1;
		}
		if (ball.x < bar.x + bar.w && ball.x > bar.x
			&& ball.y < bar.y + bar.h && ball.y > bar.y) {
			if (ball.speedX < 0) {
				gameState.myScore++;
				scoreDiv.innerText = `${ gameState.myScore } : ${ gameState.enemyScore }`;
				ball.speedX = randomSpeed();
				if (ball.speedY < 0) {
					ball.speedY = randomSpeed() * -1;
				} else {
					ball.speedY = randomSpeed();
				}
			}
		}
		
		if (ball.x < 0) {
			gameState.enemyScore++;
			gamePause();
			// gamePause();
			// setTimeout(gamePause, 2000);
		}

		for (const i in ballPos) {
			ctx.fillStyle = `rgba(${gameState.ballColor.red}, \
			${gameState.ballColor.green}, \
			${gameState.ballColor.blue}, \
			${0.02 * +i})`;
			ctx.fillRect(ballPos[i].x, ballPos[i].y, ball.w, ball.h);
		}
		ctx.fillStyle = ball.color;
		ctx.fillRect(ball.x, ball.y, ball.w, ball.h);
		
		
		ctx.font = "bold 50px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(`${ gameState.myScore } : ${ gameState.enemyScore }`, canvas.width / 2, canvas.height / 2);

	}

	// const gamePause = () => {
	// 	ball.x = canvas.width;
	// 	ball.y = (canvas.height - ball.y) / 2;
	// 	bar.y = (canvas.height - bar.h) / 2;
	// 	ballPos = new Array();
	// 	if (gameState.pause) {
	// 		gameState.pause = false;
	// 	} else {
	// 		gameState.pause = true;
	// 	}
	// }

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
			bar.y += pos;

			$socketStore.emit("game/bar", { nickname: gameInfo.me, roomKey: gameInfo.roomKey, pos: pos});

		}
	}
	
	// let loop = setInterval(draw, 0.1);

</script>

<div class="life">
	<span>{gameInfo.me} : {leftLife}</span>
	<span>{gameInfo.enemy} : {rightLife}</span>
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

