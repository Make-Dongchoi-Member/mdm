<script lang="ts">
  import { myData, socketStore } from "../../../store";
  import FriendButton from "./FriendButton.svelte";
  import { modalStatesStore } from "../../../store";
  import { onMount } from "svelte";
  import { UserState } from "../../../enums";

  onMount(() => {
    $socketStore.on("online", (data) => {
      for (const iterator of $myData.friends) {
        if (iterator.id === data.who) {
          iterator.state = UserState.ONLINE;
          break;
        }
      }
      $myData = $myData;
    });

    $socketStore.on("offline", (data) => {
      for (const iterator of $myData.friends) {
        if (iterator.id === data.who) {
          iterator.state = UserState.OFFLINE;
          break;
        }
      }
      $myData = $myData;
    });

    $socketStore.on("gaming", (data) => {
      for (const iterator of $myData.friends) {
        if (iterator.id === data.who) {
          iterator.state = UserState.GAMING;
          break;
        }
      }
      $myData = $myData;
    });
  });

  const findButtonEvent = () => {
    $modalStatesStore.isFindModal = true;
  };
</script>

<div class="members">
  <div class="other-profile-container">
    {#each $myData.friends as user}
      <FriendButton {user} />
    {/each}
  </div>
  <div class="find-area">
    <button class="find-button" on:click={findButtonEvent}>
      <i class="fa-solid fa-magnifying-glass" />
    </button>
  </div>
</div>

<style>
  .members {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 220px;
    height: 650px;
    border: 1px solid var(--border-color);
    font-size: 12px;
    box-sizing: border-box;
    padding-top: 5px;
  }

  .other-profile-container {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 100%;
    overflow-y: auto;
  }

  .other-profile-container::-webkit-scrollbar {
    width: 6px;
    height: 30px;
  }

  .other-profile-container::-webkit-scrollbar-track {
    background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
  }

  .other-profile-container::-webkit-scrollbar-thumb {
    background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
    border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
  }

  .other-profile-container::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-color); /* 스크롤바 썸바 호버 배경색 설정 */
  }

  .find-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    width: 100%;
    height: 40px;
    padding-right: 5px;
    /* border: 1px solid var(--border-color); */
  }

  .find-button {
    font-size: 22px;
    border: none;
    background-color: var(--bg-color);
  }

  .find-button:active {
    padding-top: 0.2rem;
  }
</style>
