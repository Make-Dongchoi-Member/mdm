<script lang="ts">
  import type { GameRoom } from "../../../interfaces";
  import { gameSettingStore, myData } from "../../../store";

  export let gameInfo: GameRoom;
</script>

<!-- <span>{gameInfo.playerA} : {leftLife !== undefined ? leftLife : ""}</span>
    <span>{gameInfo.playerB} : {rightLife !== undefined ? rightLife : ""}</span> -->
<div
  class="left-player-life"
  style={gameInfo.playerA === $myData.nickname
    ? `color: ${$gameSettingStore.themeColor}`
    : "color: var(--text-color)"}
>
  <span>{gameInfo.playerA}</span>
  <i class="fa-solid fa-heart" />
</div>
<div
  class="right-player-life"
  style={gameInfo.playerB === $myData.nickname
    ? `color: ${$gameSettingStore.themeColor}`
    : "color: var(--text-color)"}
>
  <i class="fa-solid fa-heart" />
  <span>{gameInfo.playerB}</span>
</div>

<style>
  .left-player-life {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .left-player-life > span {
    padding-right: 10px;
  }

  .right-player-life {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .right-player-life > span {
    padding-left: 10px;
  }
</style>
