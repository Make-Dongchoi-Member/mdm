<script lang="ts">
  import { myData } from "../../store";
  import type { MyData } from "../../interfaces";
  import { goto } from "$app/navigation";
  import GameSetting from "./(game)/GameSetting.svelte";
  import GameCanvas from "./(game)/GameCanvas.svelte";
  import ProfileModal from "./(profileModal)/ProfileModal.svelte";
</script>

<div class="game-box">
  <GameCanvas />
  {#if $myData.isInGame}
    <div class="filter" />
  {/if}
  <GameSetting />
</div>

<style>
  .game-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 650px;
  }

  .filter {
    position: absolute;
    top: 583px;

    width: 800px;
    height: 197px;

    background-color: var(--dark-color);
    opacity: 0.8;
    border: 1px solid var(--border-color);

    box-sizing: border-box;
    z-index: 2;
  }
</style>
