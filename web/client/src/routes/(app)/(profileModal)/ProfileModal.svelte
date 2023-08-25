<script lang="ts">
  import { apiUrl, modalStatesStore, profileModalStore } from "../../../store";
  import OtherInfo from "./OtherInfo.svelte";
  import { clickOutside, escapeKey } from "../../../actions";
  import ModalHistory from "./ModalHistory.svelte";
  import type { OtherUserData } from "../../../interfaces";
  import { onDestroy, onMount } from "svelte";

  let userData: OtherUserData;

  onMount(() => {
    getUserData();
  });

  onDestroy(() => {});

  const getUserData = async () => {
    const nickname: string = $profileModalStore.nickname;
    const uri: string = `${apiUrl}/api/user/info?nickname=${nickname}`;
    const response = await fetch(uri, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        userData = data;
      })
      .catch((error) => console.error("Error:", error));
  };

  const modalCloseEvent = () => {
    $modalStatesStore.isProfileModal = false;
  };
</script>

<div
  class="modal-frame"
  use:clickOutside
  on:outclick={modalCloseEvent}
  use:escapeKey
  on:esckey={modalCloseEvent}
>
  <button class="close-button" on:click={modalCloseEvent}
    ><i class="fa-solid fa-circle-xmark" /></button
  >
  <div class="modal-container">
    <div class="info_container">
      {#if userData}
        <OtherInfo user={userData} />
      {/if}
    </div>
    <div class="data_container">
      {#if userData}
        <ModalHistory records={userData.record} />
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-frame {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 860px;
    height: 710px;

    background-color: var(--dark-color);
    border: 1px solid var(--point-color);
    border-radius: 0.5rem;
    box-sizing: border-box;

    position: fixed;

    margin-top: 50px;
    margin-left: -30px;
    z-index: 10;
  }

  .modal-container {
    width: 800px;
    height: 650px;
  }

  .close-button {
    position: absolute;
    top: 2px;
    right: 3px;

    width: 30px;
    background-color: var(--dark-color);
    border: none;
    border-radius: 70%;

    margin-right: 0;
  }

  .close-button:active {
    padding-top: 0.2rem;
  }

  .info_container {
    display: flex;
    flex-direction: row;
    border: 1px solid var(--border-color);
    height: 300px;
  }

  .data_container {
    border: 1px solid var(--border-color);
    height: 330px;
    margin-top: 20px;
  }

  button {
    width: 150px;
    margin-right: 15px;
    background-color: var(--dark-color);
  }
</style>
