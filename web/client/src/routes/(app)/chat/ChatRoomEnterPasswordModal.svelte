<script lang="ts">
  import { modalStatesStore } from "../../../store";
  import { clickOutside, escapeKey } from "../../../actions";

  let isMakeButtonActivation: boolean = false;
  let passwordValue: string = "";
  export let postRoomEnter: Function;
  export let selectedRoomId: string;

  const makeButtonEvent = () => {
    postRoomEnter(selectedRoomId, passwordValue);
  };

  const passwordInputBoxEvent = (e: any) => {
    e.target.value = e.target.value.replace(/\s/g, "");
    passwordValue = e.target.value;
    isMakeButtonActivation = makeButtonActivationEvent(e.target.value);
  };

  const makeButtonActivationEvent = (password: string) => {
    if (password === "") {
      return false;
    }
    return true;
  };

  const initialInput = () => {
    passwordValue = "";
    isMakeButtonActivation = false;
  };
</script>

<div
  class="modal-container"
  style={$modalStatesStore.isPasswordInputModal
    ? "display: block;"
    : "display: none;"}
  use:clickOutside
  on:outclick={() => {
    $modalStatesStore.isPasswordInputModal = false;
    initialInput();
  }}
  use:escapeKey
  on:esckey={() => {
    $modalStatesStore.isPasswordInputModal = false;
    initialInput();
  }}
>
  <div class="modal-title">
    <div>PASSWORD</div>
    <button
      class="close-button"
      on:click={() => {
        $modalStatesStore.isPasswordInputModal = false;
        initialInput();
      }}><i class="fa-solid fa-circle-xmark" /></button
    >
  </div>
  <div class="modal-content">
    <div class="password-option">
      <input
        class="password-inputbox"
        on:input={passwordInputBoxEvent}
        bind:value={passwordValue}
        type="password"
        placeholder="PASSWORD INPUT"
        maxlength="10"
      />
    </div>
    <div>
      <button
        class={isMakeButtonActivation
          ? "make-button able"
          : "make-button disable"}
        disabled={isMakeButtonActivation ? false : true}
        on:click={makeButtonEvent}
      >
        OK
      </button>
    </div>
  </div>
</div>

<style>
  .modal-container {
    position: absolute;
    top: 150px;
    left: 50%;
    margin-left: -200px;
    width: 400px;
    height: 150px;
    z-index: 2;

    background-color: var(--dark-color);
    border: 1px solid var(--point-color);
    border-radius: 0.5rem;
  }

  .modal-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-left: 25px;
    margin-top: 25px;
    height: 40px;
  }

  .close-button {
    position: absolute;
    top: 2px;
    right: 3px;
    background-color: var(--dark-color);
    border: none;
    border-radius: 70%;
  }

  .close-button:active {
    padding-top: 0.2rem;
  }

  .modal-content {
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
    align-items: center;

    margin-top: 5px;
    margin-bottom: 25px;
  }

  .password-inputbox {
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--font-color);
    height: 38px;
    width: 220px;
  }

  .make-button {
    width: 80px;
    height: 39px;
    border: 1px solid var(--border-color);

    text-align: center;
    margin-right: 30px;
  }

  .make-button.able:hover {
    background-color: var(--hover-color);
  }

  .make-button.disable {
    color: var(--border-color);
  }

  .make-button.disable:hover {
    background-color: var(--bg-color);
  }
</style>
