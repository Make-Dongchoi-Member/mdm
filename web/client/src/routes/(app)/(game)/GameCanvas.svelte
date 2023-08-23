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
  let wait: boolean = false;
  let gaming: boolean = false;
  let gameRoomMaster: boolean = false;
  let gameOver: boolean = false;

  // 내 목숨도 서버에서 전부 관리하는 것이 더 좋을 듯.
  let leftLife: number = 1;
  let rightLife: number = 1;

  let ballSpectrums: Position[] = new Array();

  const refreshInfo = () => {
    gameInfo.playerA = "";
    gameInfo.playerB = "";
    gameInfo.roomKey = "";

    gamePrefer.message = "READY FOR THE NEXT MATCH";
    gamePrefer.controlWithMouse = false;

    $myData.isInGame = false;
    matching = false;
    ready = false;
    wait = false;
    gaming = false;
    gameRoomMaster = false;
    gameOver = false;
    ballSpectrums = new Array();
  };

  const gameReady = () => {
    if (ready === true) {
      ready = false;
      gamePrefer.message = "READY FOR THE NEXT MATCH";
      $myData.isInGame = false;
      $socketStore.emit("game/matchout", { nickname: $myData.nickname });
    } else if (ready === false) {
      // 레디 상태로 변경
      ready = true;

      // 게임 버튼 메시지 변경
      gamePrefer.message = "WAITING...";

      // 게임 스킨 설정창 비활성화
      $myData.isInGame = true;

      // 소켓에 "game/match" 로 emit, 내 닉네임과 게임 모드, 막대 컬러를 전송
      $socketStore.emit("game/match", {
        nickname: $myData.nickname,
        gameMode: $gameSettingStore.gameMode,
        barColor: $gameSettingStore.barColor,
        roomId: gameInfo.roomKey,
      });
    }
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
    gameOver = false;
    ready = false;
    wait = true;
    gamePrefer.message = "WAIT FOR THE ENEMY";
    gameRoomMaster = false;
    // if (gameInfo.playerA === $myData.nickname) gameRoomMaster = true;

    $socketStore.emit("game/revenge", {
      nickname: $myData.nickname,
      roomKey: gameInfo.roomKey,
    });
  };

  const gameQuit = () => {
    gameOver = false;
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
    refreshInfo();
    const roomKey = $page.url.searchParams.get("key");
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

      refreshInfo();
      alert(`${data.alert.receiver.nickname} refused the game!`);
    });

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
      // 배경 그리기
      ctx.fillStyle = gamePrefer.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 배경 가운데 점선 그리기
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = "#d2d2d2";
      ctx.setLineDash([20]);
      ctx.stroke();

      // 공 좌표를 받아서 잔상 만들기
      ballSpectrums.push({ x: ball.x, y: ball.y });
      if (ballSpectrums.length > 35) {
        ballSpectrums.shift();
      }

      // 왼쪽 막대 정보 받아 저장하기
      leftBar.y = arg.playerA.bar.y;
      leftBar.h = arg.playerA.bar.h;
      leftBar.color = arg.playerA.bar.color;

      // 오른쪽 막대 정보 받아 저장하기
      rightBar.y = arg.playerB.bar.y;
      rightBar.h = arg.playerB.bar.h;
      rightBar.color = arg.playerB.bar.color;

      // 왼쪽, 오른쪽 막대 그리기
      ctx.fillStyle = leftBar.color;
      ctx.fillRect(leftBar.x, leftBar.y, leftBar.w, leftBar.h);
      ctx.fillStyle = rightBar.color;
      ctx.fillRect(rightBar.x, rightBar.y, rightBar.w, rightBar.h);

      // 공 정보 받아 저장하기
      ball.x = arg.ball.x;
      ball.y = arg.ball.y;

      // 공 잔상 그리기
      for (const i in ballSpectrums) {
        // TODO *****************************************
        // 이 부분에서 공 색깔에 따라 잔상 색깔도 반영되도록 변경해야함
        // gamesettingstore의 ballcolor를 활용하되, fillStyle말고 다른 메소드를 활용해 투명도만 조절할 수 있는지 찾아볼 것.
        // 밑의 코드대로 구현할 경우 공의 바뀐 색깔은 반영이 되지만 잔상의 자국이 남는 버그가 있으므로 고칠 것.

        // ctx.fillStyle = `rgba(
        // ${gamePrefer.ballColor.red},
        // ${gamePrefer.ballColor.green},
        // ${gamePrefer.ballColor.blue},
        // ${0.02 * +i}
        // )`;
        ctx.fillStyle = $gameSettingStore.ballColor;
        ctx.globalAlpha = 0.02 * +i;
        ctx.fillRect(ballSpectrums[i].x, ballSpectrums[i].y, ball.w, ball.h);
      }

      // 공 그리기
      ctx.fillStyle = $gameSettingStore.ballColor;
      ctx.fillRect(ball.x, ball.y, ball.w, ball.h);

      // 목숨 정보 받아 저장하기
      leftLife = arg.playerA.life;
      rightLife = arg.playerB.life;
    });

    $socketStore.on("game/pause", (arg: string) => {
      gaming = true;
      ballSpectrums = new Array();
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
      // refreshInfo();
      ready = false;
      gaming = false;
      gameRoomMaster = false;
      ballSpectrums = new Array();
      gamePrefer.controlWithMouse = false;
      document.exitPointerLock();
      gameOver = true;
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
      refreshInfo();
      gamePrefer.controlWithMouse = false;
      document.exitPointerLock();
    });
  });

  onDestroy(() => {
    $socketStore.off("game/match");
    $socketStore.off("game/room");
    $socketStore.off("game/play");
    $socketStore.off("game/private-match-deny");
    $socketStore.off("game/pause");
    $socketStore.off("game/end");
    $socketStore.off("game/quit");
    canvas.removeEventListener("click", mouseControl);
    document.removeEventListener("mousemove", handleMousePointer);
    if (matching) {
      if (gameOver) {
        $socketStore.emit("game/quit", {
          nickname: $myData.nickname,
          roomKey: gameInfo.roomKey,
        });
      } else {
        $socketStore.emit("game/roomout", {
          nickname: $myData.nickname,
          roomKey: gameInfo.roomKey,
        });
      }
    } else {
      $socketStore.emit("game/matchout", { nickname: $myData.nickname });
      $socketStore.emit("game/private-matchout", { roomKey: gameInfo.roomKey });
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
    <button
      disabled={wait}
      class={ready ? "ready-off" : "ready-on"}
      on:click={gameReady}>{gamePrefer.message}</button
    >
  {/if}
  {#if gameOver}
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

  .button-area > .ready-off,
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
