<script lang="ts">
  import type { GameRoom } from "../../../interfaces";
  import { gameSettingStore, myData } from "../../../store";

  export let gameInfo: GameRoom;
  export let leftLife: number;
  export let rightLife: number;
</script>

<div
  class="left-player-life"
  style={gameInfo.playerA === $myData.nickname
    ? `color: ${$gameSettingStore.themeColor}`
    : "color: var(--text-color)"}
>
  <span>{gameInfo.playerA}</span>
  {#each Array(leftLife) as _}
    <i class="fa-solid fa-heart" />
  {/each}
</div>
<div
  class="right-player-life"
  style={gameInfo.playerB === $myData.nickname
    ? `color: ${$gameSettingStore.themeColor}`
    : "color: var(--text-color)"}
>
  {#each Array(rightLife) as _}
    <i class="fa-solid fa-heart" />
  {/each}
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

  .left-player-life > i {
    padding-right: 5px;
  }

  .right-player-life {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .right-player-life > span {
    padding-left: 10px;
  }

  .right-player-life > i {
    padding-left: 5px;
  }
</style>
