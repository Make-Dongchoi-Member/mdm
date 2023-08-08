<script lang="ts">
	import { onMount } from 'svelte';
	import { spaceKey } from '../../../actions';
	import { gameSettingStore, socketStore } from '../../../store';
	import type { GameData } from '../../../interfaces';

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

	let ballPos: Position[] = new Array();

	onMount( async () => {
		scoreDiv = document.getElementById("score") as HTMLDivElement;
		canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
		ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	
		canvas.width = 800;
		canvas.height = 430;

		canvas.addEventListener('click', () => {
			if (gameState.controlWithMouse) {
				gameState.controlWithMouse = false;
				gameState.pause = true;
				document.exitPointerLock();
			} else {
				gameState.controlWithMouse = true;
				gameState.pause = false;
				canvas.requestPointerLock();
			}
		});

		$socketStore.on("game", (arg: GameData) => {
			bar = {
				w: 7,
			h: gameState.basicModeBar,
			x: 10,
			y: arg.bar.y,
			speed: 0,
			color: gameState.barColor,
			}
		});
	});

	function randomSpeed(): number {
		return (Math.random() + gameState.speed);
	}

	const waitPage = () => {
		ctx.fillStyle = gameState.backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		bar.h = ($gameSettingStore.gameMode === "hard") ?
					gameState.hardModeBar : gameState.basicModeBar;
		bar.y = (canvas.height - bar.h) / 2;
		ctx.fillStyle = bar.color;
		ctx.fillRect(bar.x, bar.y, bar.w, bar.h);

		ctx.fillStyle = ballColorString;
		ctx.font = "bold 50px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(`${ gameState.myScore } : ${ gameState.enemyScore }`,
						canvas.width / 2, canvas.height / 2);
	}

	const gamePage = () => {
		// 게임 진행 페이지
	}





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

	const gamePause = () => {
		ball.x = canvas.width;
		ball.y = (canvas.height - ball.y) / 2;
		bar.y = (canvas.height - bar.h) / 2;
		ballPos = new Array();
		if (gameState.pause) {
			gameState.pause = false;
		} else {
			gameState.pause = true;
		}
	}
	const handleMousePointer = (event: MouseEvent) => {
		if (gameState.controlWithMouse) {
			const pos = event.movementY;
			bar.y += pos;

			const gameData: GameData = {
			ball: ball,
			bar: bar,
			}

			$socketStore.emit("game", gameData);

		}
	}

	// const handleKeyDown = (event: KeyboardEvent) => {
	// 	const key = event.key;
	// 	switch (key) {
	// 		case "ArrowUp":
	// 			if (bar.y > 0) {
	// 				bar.speed = -3;
	// 			}
	// 			break;

	// 		case "ArrowDown":
	// 			if (bar.y + bar.h < canvas.height) {
	// 				bar.speed = 3;
	// 			}
	// 			break;
			
	// 		default:
	// 			break;
	// 	}
	// }

	// const handleKeyUp = (event: KeyboardEvent) => {
	// 	const key = event.key;
	// 	switch (key) {
	// 		case "ArrowUp":
	// 			if (bar.y > 0) {
	// 				bar.speed = 0;
	// 			}
	// 			break;

	// 		case "ArrowDown":
	// 			if (bar.y + bar.h < canvas.height) {
	// 				bar.speed = 0;
	// 			}
	// 			break;
			
	// 		default:
	// 			break;
	// 	}
	// }

	// document.addEventListener('keydown', handleKeyDown);
	// document.addEventListener('keyup', handleKeyUp);
	document.addEventListener('mousemove', handleMousePointer);
	
	let loop = setInterval(draw, 0.1);

</script>

<div class="life">
	<span>my life : {gameState.myScore}</span>
	<span>enemy life : {gameState.enemyScore}</span>
</div>
<canvas id="game-canvas">Canvas</canvas>
<div use:spaceKey on:spacekey={gamePause} id="score">
	0 : 0
</div>
<!--<button on:click={gamePause}>game start</button>-->

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

