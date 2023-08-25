<script lang="ts">
  import { apiUrl, modalStatesStore, myData } from "../../../store";
  import { clickOutside, escapeKey } from "../../../actions";

  let isInvalidNickname: boolean = false;
  let block: boolean = false;
  let nickname: string = "";
  let onChanging: boolean = false;

  const focusEvent = () => {
    isInvalidNickname = false;
  };

  const nicknameClickEvent = () => {
    block = true;
    onChanging = true;
    nicknameSetAPI({ data: { nickname } }).then((res) => {
      setTimeout(() => {
        if (res) {
          const status = res.status;
          if (status === 201) {
            $modalStatesStore.isNicknameModal = false;
            $myData.nickname = nickname;
            block = false;
          } else {
            isInvalidNickname = true;
            block = false;
          }
        }
        onChanging = false;
      }, 1000);
    });
  };

  async function nicknameSetAPI(data: any) {
    try {
      const response = await fetch(`${apiUrl}/api/user/set/nickname`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("실패:", error);
    }
  }

  const modalCloseEvent = () => {
    if (!onChanging) {
      $modalStatesStore.isNicknameModal = false;
      nickname = "";
      block = false;
      isInvalidNickname = false;
    }
  };
</script>

<div
  class="modal-container"
  style={$modalStatesStore.isNicknameModal
    ? "display: flex;"
    : "display: none;"}
  use:clickOutside
  on:outclick={modalCloseEvent}
  use:escapeKey
  on:esckey={modalCloseEvent}
>
  <button class="close-button" on:click={modalCloseEvent}
    ><i class="fa-solid fa-circle-xmark" /></button
  >
  <div class="modal-title">NEW NICKNAME</div>
  <div class="modal-content">
    <form>
      <input
        type="text"
        maxlength="10"
        placeholder="put your new nickname"
        bind:value={nickname}
        on:focus={focusEvent}
        class={isInvalidNickname ? "invalid" : "valid"}
        disabled={block ? true : false}
        required
      />
      <button on:click={nicknameClickEvent} type="submit"
        ><i class="fa-solid fa-paper-plane" /></button
      >
    </form>
  </div>
</div>

<style>
  .modal-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    width: 530px;
    height: 150px;

    background-color: var(--dark-color);
    border: 1px solid var(--point-color);
    border-radius: 0.5rem;

    position: absolute;

    margin-top: 130px;
    margin-left: 135px;
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

  .modal-title {
    text-align: center;
  }

  .modal-content {
    display: flex;
    flex-direction: row;
    justify-content: center;

    width: 280px;
  }

  .valid {
    width: 300px;
    height: 45px;
    margin: 0;
    padding: 0;
    color: var(--text-color);
    caret-color: var(--intra-color);
    border: 2px solid var(--text-color);
    box-sizing: border-box;
    background: none;
    font-weight: 400;
    text-align: center;
  }

  input:focus {
    outline: none;
    border: 2px solid var(--intra-color);
  }

  input:focus::placeholder {
    color: transparent;
  }

  .invalid {
    width: 300px;
    height: 45px;
    margin: 0;
    padding: 0;
    color: var(--text-color);
    caret-color: var(--intra-color);
    border: 2px solid rgb(200, 0, 0);
    box-sizing: border-box;
    background: none;
    font-weight: 400;
    text-align: center;
  }

  input[type="text"]:disabled {
    width: 300px;
    height: 45px;
    margin: 0;
    padding: 0;
    color: var(--border-color);
    caret-color: var(--border-color);
    border: 2px solid var(--border-color);
    box-sizing: border-box;
    background: none;
    font-weight: 400;
    text-align: center;
  }

  form {
    position: relative;
  }

  form > button {
    position: absolute;
    top: 7px;
    right: 10px;

    border: none;
    background-color: var(--dark-color);
  }

  form > button:active {
    padding-top: 0.2rem;
  }
</style>
