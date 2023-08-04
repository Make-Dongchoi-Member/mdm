<script lang="ts">
	import { onMount } from 'svelte';
	import { spaceKey } from '../../../actions';
	import { gameSettingStore } from '../../../store';
	

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
	
	let barHeightHard: number = 50;
	let barHeightBasic: number = 120;
	let speed: number = 2.5;
	let myScore: number = 0;
	let enemyScore: number = 0;
	let pause: boolean = true;
	let controlWithMouse: boolean = false;

	const ball: Ball = {
		w: 6,
		h: 6,
		x: 0,
		y: 0,
		speedX: 3,
		speedY: 3,
		color: "rgba(200, 200, 200, 1)",
	}

	const bar: Bar = {
		w: 7,
		h: barHeightBasic,
		x: 10,
		y: 180,
		speed: 0,
		color: $gameSettingStore.barColor,
	}

	let ballPos: Position[] = new Array();

	onMount( async () => {
		scoreDiv = document.getElementById("score") as HTMLDivElement;
		canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
		ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	
		canvas.width = 798;
		canvas.height = 430;

		canvas.addEventListener('click', () => {
			if (controlWithMouse) {
				controlWithMouse = false;
				document.exitPointerLock();
			} else {
				controlWithMouse = true;
				canvas.requestPointerLock();
			}
		});
	});

	function randomSpeed(): number {
		return (Math.random() + speed);
	}

	const draw = () => {
		if (pause) {
			return;
		}

		ballPos.push({x: ball.x, y: ball.y});
		if (ballPos.length > 35) {
			ballPos.shift();
		}

		if ($gameSettingStore.gameMode === "hard") {
			bar.h = barHeightHard;
		} else if ($gameSettingStore.gameMode === "basic") {
			bar.h = barHeightBasic;
		}

		ctx.fillStyle = "rgba(66, 66, 66)";
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
				myScore++;
				scoreDiv.innerText = `${ myScore } : ${ enemyScore }`;
				ball.speedX = randomSpeed();
				if (ball.speedY < 0) {
					ball.speedY = randomSpeed() * -1;
				} else {
					ball.speedY = randomSpeed();
				}
			}
		}

		if (ball.x < 0) {
			enemyScore++;
			gamePause();
			setTimeout(gamePause, 2000);
		}

		for (const i in ballPos) {
			ctx.fillStyle = `rgba(200, 200, 200, ${0.02 * +i})`;
			ctx.fillRect(ballPos[i].x, ballPos[i].y, ball.w, ball.h);
		}
		ctx.fillStyle = ball.color;
		ctx.fillRect(ball.x, ball.y, ball.w, ball.h);


		ctx.font = "bold 50px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(`${ myScore } : ${ enemyScore }`, canvas.width / 2, canvas.height / 2);

	}

	const gamePause = () => {
		ctx.fillStyle = "rgba(66, 66, 66)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ball.x = canvas.width;
		ball.y = (canvas.height - ball.y) / 2;
		ctx.fillStyle = ball.color;
		ctx.fillRect(ball.x, ball.y, ball.w, ball.h);
		bar.y = (canvas.height - bar.h) / 2;
		ctx.fillStyle = bar.color;
		ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
		ballPos = new Array();
		ctx.font = "bold 50px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(`${ myScore } : ${ enemyScore }`, canvas.width / 2, canvas.height / 2);
		if (pause) {
			pause = false;
		} else {
			pause = true;
		}
	}
	const handleMousePointer = (event: MouseEvent) => {
		if (controlWithMouse) {
			const pos = event.movementY;

			bar.y += pos;
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

<div class="game-frame"
	use:spaceKey on:spacekey={gamePause}>
	<canvas id="game-canvas">Canvas</canvas>
</div>
<div use:spaceKey on:spacekey={gamePause} id="score">
	0 : 0
</div>
<button on:click={gamePause}>game start</button>

<style>
	#score {
		display: none;
	}

	.game-frame {
		border: 1px solid var(--border-color);
		width: 800px;
		height: 450px;
		box-sizing: border-box;
	}
</style>

