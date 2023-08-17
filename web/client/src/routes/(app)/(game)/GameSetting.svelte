<script lang="ts">
  import { onMount } from "svelte";
  import { gameSettingStore } from "../../../store";
  import { clickOutside } from "../../../actions";

  let isColorOptionShow: boolean = false;
  let isShapeOptionShow: boolean = false;

  interface gameMode {
    [index: string]: boolean;
    basic: boolean;
    hard: boolean;
  }

  let mode: gameMode = {
    basic: true,
    hard: false,
  };

  const gameModeSetEvent = (e: any) => {
    for (const key of Object.keys(mode)) {
      mode[key] = false;
    }
    mode[e.target.value] = true;
    $gameSettingStore.gameMode = e.target.value;
  };

  const colorButtonEvent = () => {
    isColorOptionShow = !isColorOptionShow;
    isShapeOptionShow = false;
  };

  const shapeButtonEvent = () => {
    isShapeOptionShow = !isShapeOptionShow;
    isColorOptionShow = false;
  };

  const barColorEvent = (e: any) => {
    $gameSettingStore.barColor = e.target.value;
    isColorOptionShow = false;
  };

  const ballShapeEvent = (e: any) => {
    $gameSettingStore.ballShape = e.target.value;
    isShapeOptionShow = false;
  };

  const optionCloseEvent = () => {
    if (isColorOptionShow || isShapeOptionShow) {
      isColorOptionShow = false;
      isShapeOptionShow = false;
    }
  };
</script>

<div class="game-setting">
  <div class="game-mode">
    <div>GAME MODE</div>
    <button
      value="basic"
      class={mode.basic ? "selected" : ""}
      on:click={gameModeSetEvent}>BASIC</button
    >
    <button
      value="hard"
      class={mode.hard ? "selected" : ""}
      on:click={gameModeSetEvent}>HARD</button
    >
  </div>
  <div class="skin-option">
    <div>SKIN OPTION</div>
    <div class="color-option">
      <button on:click={colorButtonEvent}>
        BAR COLOR
        <div
          class="color-circle"
          style="background-color: {$gameSettingStore.barColor}"
        />
      </button>
      <div
        class="test"
        style="display: {isColorOptionShow ? 'flex' : 'none'}"
        use:clickOutside
        on:outclick={optionCloseEvent}
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
      <button on:click={shapeButtonEvent}> BALL SHAPE </button>
      <div style="display: {isShapeOptionShow ? 'flex' : 'none'}">
        <button value="square" on:click={ballShapeEvent}> Square </button>
        <button value="diamond" on:click={ballShapeEvent}> Diamond </button>
        <button value="circle" on:click={ballShapeEvent}> Circle </button>
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

  .color-circle {
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
