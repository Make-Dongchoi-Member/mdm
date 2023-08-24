<script lang="ts">
  import { onMount } from "svelte";
  import { gameSettingStore } from "../../../store";
  import { clickOutside } from "../../../actions";

  let barColorOptionOpen: boolean = false;
  let ballColorOptionOpen: boolean = false;

  const gameModeSetEvent = (e: any) => {
    $gameSettingStore.gameMode = e.target.value;
  };

  const barColorList = () => {
    barColorOptionOpen = !barColorOptionOpen;
    ballColorOptionOpen = false;
  };

  const ballColorList = () => {
    ballColorOptionOpen = !ballColorOptionOpen;
    barColorOptionOpen = false;
  };

  const barColorEvent = (e: any) => {
    $gameSettingStore.barColor = e.target.value;
    barColorOptionOpen = false;
  };

  const ballColorEvent = (e: any) => {
    $gameSettingStore.ballColor = e.target.value;
    ballColorOptionOpen = false;
  };

  const barOptionCloseEvent = () => {
    barColorOptionOpen = false;
  };

  const ballOptionCloseEvent = () => {
    ballColorOptionOpen = false;
  };
</script>

<div class="game-setting">
  <div class="game-mode">
    <div>GAME MODE</div>
    <button
      value="basic"
      class={$gameSettingStore.gameMode === "basic" ? "selected" : ""}
      on:click={gameModeSetEvent}>BASIC</button
    >
    <button
      value="hard"
      class={$gameSettingStore.gameMode === "hard" ? "selected" : ""}
      on:click={gameModeSetEvent}>HARD</button
    >
  </div>
  <div class="skin-option">
    <div>SKIN OPTION</div>
    <div class="color-option">
      <button on:click={barColorList}>
        BAR COLOR
        <div
          class="bar-color-circle"
          style="background-color: {$gameSettingStore.barColor}"
        />
      </button>
      <div
        style="display: {barColorOptionOpen ? 'flex' : 'none'}"
        use:clickOutside
        on:outclick={barOptionCloseEvent}
      >
        <button
          value="#ff6231"
          on:click={barColorEvent}
          style="background-color: #ff6231"
        />
        <button
          value="#00BABC"
          on:click={barColorEvent}
          style="background-color: #00babc"
        />
        <form>
          <input type="color" bind:value={$gameSettingStore.barColor} />
        </form>
      </div>
    </div>
    <div class="shape-option">
      <button on:click={ballColorList}>
        BALL COLOR
        <div
          class="ball-color-circle"
          style="background-color: {$gameSettingStore.ballColor}"
        />
      </button>
      <div
        style="display: {ballColorOptionOpen ? 'flex' : 'none'}"
        use:clickOutside
        on:outclick={ballOptionCloseEvent}
      >
        <button
          value="#ff6231"
          on:click={ballColorEvent}
          style="background-color: #ff6231"
        />
        <button
          value="#00BABC"
          on:click={ballColorEvent}
          style="background-color: #00babc"
        />
        <form>
          <input type="color" bind:value={$gameSettingStore.ballColor} />
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  .game-setting {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border: 1px solid var(--border-color);
    padding: 30px 20px 20px 20px;
  }

  .game-mode {
    display: flex;
    width: 45%;
    flex-direction: column;
    align-content: center;
    text-align: center;
  }

  .skin-option {
    display: flex;
    flex-direction: column;
    width: 340px;
    text-align: center;
    box-sizing: border-box;
  }

  .skin-option > div {
    position: relative;
  }

  .skin-option > div > button,
  .game-mode > button {
    width: 340px;
    height: 40px;
  }

  .game-mode > div,
  .skin-option > div,
  .game-mode > button {
    margin-bottom: 15px;
  }

  .color-option > div {
    position: absolute;
    width: 340px;
    top: 40px;
    left: 0px;
    display: none;
    flex-direction: column;
    z-index: 1;
    background-color: var(--bg-color);
  }

  .shape-option > div {
    position: absolute;
    width: 340px;
    top: 40px;
    left: 0px;
    display: none;
    flex-direction: column;
    z-index: 1;
    background-color: var(--bg-color);
  }

  .skin-option > div > div > button {
    position: relative;
    margin-top: 5px;
    width: 340px;
  }

  .skin-option > div > div > form {
    position: relative;
    margin-top: 5px;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 340px;
    height: 30px;
    border: 1px solid var(--border-color);
    box-sizing: border-box;
  }

  .selected {
    border: 1px solid var(--point-color);
    background-color: var(--hover-color);
  }

  .bar-color-circle,
  .ball-color-circle {
    position: absolute;
    top: 12px;
    right: 14px;

    width: 15px;
    height: 15px;
    border: 1px solid var(--text-color);
    border-radius: 70%;
    box-sizing: border-box;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    background: transparent;
    margin: 10px;
  }

  input[type="color" i] {
    background: linear-gradient(
      45deg,
      rgb(255, 9, 230),
      rgb(255, 132, 0),
      rgb(19, 255, 172)
    );
    border: none;
    width: 340px;
    height: 28px;
    box-sizing: border-box;
  }
</style>
