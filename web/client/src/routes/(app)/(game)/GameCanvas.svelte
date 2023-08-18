<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { gameSettingStore, socketStore, myData } from "../../../store";
  import type {
    Ball,
    Bar,
    GameRoom,
    GameStatus,
    Position,
  } from "../../../interfaces";
  import { GameState } from "../../../enums";

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
  let gameRoomMaster: boolean = false;
  let gameEnd: boolean = false;

  // 내 목숨도 서버에서 전부 관리하는 것이 더 좋을 듯.
  let leftLife: number = 1;
  let rightLife: number = 1;

  let ballSpectrums: Position[] = new Array();

  const gameReady = () => {
    // 이미 레디 눌렀으면 동작 안 함
    if (ready) return;

    // 레디 상태로 변경
    ready = true;

    // 게임 버튼 메시지 변경
    gamePrefer.message = "WAITING...";

    // 소켓에 "game/match" 로 emit, 내 닉네임과 게임 모드, 막대 컬러를 전송
    $socketStore.emit("game/match", {
      nickname: $myData.nickname,
      gameMode: $gameSettingStore.gameMode,
      barColor: $gameSettingStore.barColor,
    });
  };

  const gameStart = () => {
    // 서버로부터 게임 정보를 받아서 매칭이 된 경우에만 동작
    // 소켓에 "game/start" 로 emit, 방장 플레이어의 닉네임과 소켓 룸 키를 전송
    if (matching) {
      $socketStore.emit("game/start", {
        nickname: gameInfo.playerA,
        roomKey: gameInfo.roomKey,
      });
    }
  };

  const revengeMatch = () => {
    gameEnd = false;
    ready = true;
    gaming = true;
    gamePrefer.message = "WAIT FOR THE ENEMY";
    if (gameInfo.playerA === $myData.nickname) gameRoomMaster = true;

    $socketStore.emit("game/revenge", {
      nickname: $myData.nickname,
      roomKey: gameInfo.roomKey,
    });
  };

  const gameQuit = () => {
    gameEnd = false;
    $socketStore.emit("game/quit", {
      nickname: $myData.nickname,
      roomKey: gameInfo.roomKey,
    });
    gamePrefer.controlWithMouse = false;
    document.exitPointerLock();
  };

  const handleMousePointer = (event: MouseEvent) => {
    if (gamePrefer.controlWithMouse) {
      const pos = event.movementY;

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
    canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = 800;
    canvas.height = 430;

    canvas.addEventListener("click", mouseControl);
    document.addEventListener("mousemove", handleMousePointer);

    $socketStore.on("game/room", (arg: GameRoom) => {
      // 서버로 부터 받은 게임 정보를 저장
      gameInfo = arg;
      if (arg.roomKey.length > 0) {
        matching = true;
        gamePrefer.message = "WAIT TO START";
      }

      // 서버 큐에 먼저 들어갔던 플레이어(방장 플레이어)가 왼쪽에 배치되어야 하므로 변수에 해당 정보 저장
      if (gameInfo.playerA === $myData.nickname) gameRoomMaster = true;
    });

    $socketStore.on("game/play", (arg: GameStatus) => {
      gaming = true;

      ctx.fillStyle = gamePrefer.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = "#d2d2d2";
      ctx.setLineDash([20]);
      ctx.stroke();

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

    $socketStore.on("game/pause", (arg: string) => {
      if (arg === "restart") {
        $socketStore.emit("game/start", {
          nickname: $myData.nickname,
          roomKey: gameInfo.roomKey,
        });
        return;
      }

      ctx.fillStyle = gamePrefer.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#d2d2d2";
      ctx.font = "bold 60px sans-serif";
      ctx.fillText(arg, canvas.width / 2, canvas.height / 2);
    });

    $socketStore.on("game/end", (arg: GameStatus) => {
      leftLife = arg.playerA.life;
      rightLife = arg.playerB.life;

      ctx.fillStyle = gamePrefer.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 승자의 닉네임을 저장
      let winner: string = arg.playerA.nickname;
      if (arg.playerB.life > 0) {
        winner = arg.playerB.nickname;
      }
      if ($myData.nickname === winner) {
        // 내가 이김
        gamePrefer.message = "YOU WIN!";
      } else {
        // 내가 짐
        gamePrefer.message = "YOU LOSE";
      }
      gamePrefer.controlWithMouse = false;
      document.exitPointerLock();
      gameRoomMaster = false;
      gaming = false;
      gameEnd = true;
    });

    $socketStore.on("game/quit", (arg: GameStatus) => {
      leftLife = arg.playerA.life;
      rightLife = arg.playerB.life;

      ctx.fillStyle = gamePrefer.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 승자의 닉네임을 저장
      let winner: string = arg.playerA.nickname;
      if (arg.playerB.life > 0) {
        winner = arg.playerB.nickname;
      }
      if ($myData.nickname === winner) {
        // 내가 이김
        gamePrefer.message = "YOU WIN!";
      } else {
        // 내가 짐
        gamePrefer.message = "YOU LOSE";
      }

      gamePrefer.controlWithMouse = false;
      document.exitPointerLock();
      gaming = false;
      gameRoomMaster = false;
      ready = false;
      gameEnd = false;
    });
  });

  onDestroy(() => {
    $socketStore.off("game/match");
    $socketStore.off("game/play");
    canvas.removeEventListener("click", mouseControl);
    document.removeEventListener("mousemove", handleMousePointer);
    if (matching) {
      $socketStore.emit("game/quit", {
        nickname: $myData.nickname,
        roomKey: gameInfo.roomKey,
      });
    } else {
      $socketStore.emit("game/matchout", { nickname: $myData.nickname });
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
  {#if gameRoomMaster}
    <button on:click={gameStart}>GAME START</button>
  {:else if !gameRoomMaster}
    <button disabled={ready} on:click={gameReady}>{gamePrefer.message}</button>
  {/if}
  {#if gameEnd}
    <div class="rematch">
      <button on:click={gameQuit}>QUIT THE GAME</button>
      <button on:click={revengeMatch}>REMATCH</button>
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
