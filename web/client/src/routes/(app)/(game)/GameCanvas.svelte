<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { gameSettingStore, socketStore, myData } from "../../../store";
  import type {
  AlertDTO,
    Ball,
    Bar,
    GameRoom,
    GameStatus,
    Position,
  } from "../../../interfaces";
  import { GameState } from "../../../enums";
  import { page } from "$app/stores";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  interface BallColorRGB {
    red: number;
    green: number;
    blue: number;
  }

  interface GamePrefer {
    message: string;
    controlWithMouse: boolean;
    backgroundColor: string;
    ballColor: BallColorRGB;
    barColor: string;
  }

  let gamePrefer: GamePrefer = {
    message: "READY FOR THE NEXT MATCH",
    controlWithMouse: false,
    backgroundColor: "#424242",
    ballColor: { red: 200, green: 200, blue: 200 },
    barColor: $gameSettingStore.barColor,
  };

  let ballColorString: string = `rgb(
      ${gamePrefer.ballColor.red},
      ${gamePrefer.ballColor.green},
      ${gamePrefer.ballColor.blue}
    )`;

  const ball: Ball = {
    w: 6,
    h: 6,
    x: 0,
    y: 0,
    speedX: 3,
    speedY: 3,
    color: ballColorString,
  };

  let leftBar: Bar = {
    w: 7,
    h: 120,
    x: 0,
    y: 180,
    speed: 0,
    color: gamePrefer.barColor,
  };

  let rightBar: Bar = {
    w: 7,
    h: 120,
    x: 793,
    y: 180,
    speed: 0,
    color: gamePrefer.barColor,
  };

  let gameInfo: GameRoom = {
    playerA: "",
    playerB: "",
    roomKey: "",
  };

  let matching: boolean = false;
  let ready: boolean = false;
  let gaming: boolean = false;
  let gameHost: boolean = false;
  let gameEnd: boolean = false;

  // 내 목숨도 서버에서 전부 관리하는 것이 더 좋을 듯.
  let leftLife: number = 5;
  let rightLife: number = 5;

  let ballSpectrums: Position[] = new Array();

  const gameReady = () => {
    if (ready) return;
    ready = true;
    gamePrefer.message = "WAITING...";
    $socketStore.emit("game/match", {
      nickname: $myData.nickname,
      gameMode: $gameSettingStore.gameMode,
      barColor: $gameSettingStore.barColor,
      roomId: gameInfo.roomKey,
    });
  };

  const gameStart = () => {
    gameEnd = false;
    if (matching) {
      $socketStore.emit("game/start", {
        nickname: gameInfo.playerA,
        roomKey: gameInfo.roomKey,
      });
    }
  };

  const gameQuit = () => {
    gameEnd = false;
    $socketStore.emit("game/quit", {
      nickname: $myData.nickname,
      roomKey: gameInfo.roomKey,
    });
  };

  const handleMousePointer = (event: MouseEvent) => {
    if (gamePrefer.controlWithMouse) {
      const pos = event.movementY;
      console.log(pos);

      $socketStore.emit("game/bar", {
        nickname: $myData.nickname,
        roomKey: gameInfo.roomKey,
        pos: pos,
      });
    }
  };

  const mouseControl = () => {
    if (!matching) return;
    if (gamePrefer.controlWithMouse) {
      gamePrefer.controlWithMouse = false;
      document.exitPointerLock();
    } else {
      gamePrefer.controlWithMouse = true;
      canvas.requestPointerLock();
    }
  };

  onMount(() => {
    const roomKey = $page.url.searchParams.get('key');
    if (roomKey !== null) {
      gameInfo.roomKey = roomKey;
      ready = true;
      gamePrefer.message = "WAITING...";
    }
    canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = 800;
    canvas.height = 430;

    canvas.addEventListener("click", mouseControl);
    document.addEventListener("mousemove", handleMousePointer);

    $socketStore.on("game/private-match-deny", (data: AlertDTO) => {
      console.log(data);
      
      /**
       * @TODO
       * 게임 페이지 초기화
      */
      alert(`${data.alert.receiver.nickname} refused the game!`);
      
    });

    $socketStore.on("game/room", (arg: GameRoom) => {
      gameInfo = arg;
      if (arg.roomKey.length > 0) {
        matching = true;
        gamePrefer.message = "WAIT TO START";
      }
      if (gameInfo.playerA === $myData.nickname) gameHost = true;
    });

    $socketStore.on("game/play", (arg: GameStatus) => {
      if (arg.state === GameState.GAMING) {
        gaming = true;
      } else {
        return;
      }
      ctx.fillStyle = gamePrefer.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ballSpectrums.push({ x: ball.x, y: ball.y });
      if (ballSpectrums.length > 35) {
        ballSpectrums.shift();
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
      for (const i in ballSpectrums) {
        ctx.fillStyle = `rgba(
        ${gamePrefer.ballColor.red},
        ${gamePrefer.ballColor.green},
        ${gamePrefer.ballColor.blue},
        ${0.02 * +i}
        )`;
        ctx.fillRect(ballSpectrums[i].x, ballSpectrums[i].y, ball.w, ball.h);
      }
      ctx.fillStyle = ball.color;
      ctx.fillRect(ball.x, ball.y, ball.w, ball.h);

      leftLife = arg.playerA.life;
      rightLife = arg.playerB.life;
    });

    $socketStore.on("game/end", (arg: GameStatus) => {
      ctx.fillStyle = gamePrefer.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let winner: string;
      if (arg.playerA.life > 0) {
        winner = arg.playerA.nickname;
      } else {
        winner = arg.playerB.nickname;
      }
      if ($myData.nickname === winner) {
        // 내가 이김
        gamePrefer.message = "YOU WIN!";
      } else {
        // 내가 짐
        gamePrefer.message = "YOU LOSE";
      }
      mouseControl();
      // ready = false;
      // matching = false;
      gameHost = false;
      gaming = false;
      gameEnd = true;
    });
  });

  onDestroy(() => {
    $socketStore.off("game/match");
    $socketStore.off("game/play");
    $socketStore.off("game/private-match-deny")
    canvas.removeEventListener("click", mouseControl);
    document.removeEventListener("mousemove", handleMousePointer);
    if (matching) {
      $socketStore.emit("game/quit", {
        nickname: $myData.nickname,
        roomKey: gameInfo.roomKey,
      });
    } else {
      $socketStore.emit("game/matchout", { nickname: $myData.nickname });
      console.log(gameInfo)
      $socketStore.emit("game/private-matchout", { roomKey : gameInfo.roomKey })
    }
  });
</script>

<div class="life">
  {#if matching}
    <span>{gameInfo.playerA} : {leftLife}</span>
    <span>{gameInfo.playerB} : {rightLife}</span>
  {/if}
</div>
<canvas id="game-canvas">Canvas</canvas>
<div class="button-area" style={gaming ? "display: none" : "display: flex"}>
  {#if gameHost}
    <button on:click={gameStart}>GAME START</button>
  {:else if !gameHost}
    <button disabled={ready} on:click={gameReady}>{gamePrefer.message}</button>
  {/if}
  {#if gameEnd}
    <div class="rematch">
      <button on:click={gameQuit}>QUIT THE GAME</button>
      <button on:click={gameStart}>REMATCH</button>
    </div>
  {/if}
</div>

<style>
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

  .button-area {
    position: absolute;
    top: 315px;

    height: 200px;
    width: 800px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    box-sizing: border-box;
  }

  .button-area > button {
    width: 750px;
    height: 60px;
    font-size: 25px;
    font-weight: 100;
  }

  .button-area > button:disabled {
    background-color: var(--hover-color);
    border: 1px solid var(--point-color);
  }

  .rematch {
    display: flex;
    justify-content: space-around;
    width: 450px;
    margin-top: 20px;
  }

  .rematch > button {
    width: 200px;
    height: 40px;
    background-color: var(--dark-color);
  }

  .rematch > button:hover {
    background-color: var(--hover-color);
  }
</style>
