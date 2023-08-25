<script lang="ts">
  import type { Profile, SetRequestDTO } from "../../../../interfaces";
  import { Level } from "../../../../enums";
  import {
    myData,
    socketStore,
    openedRoom,
    modalStatesStore,
    profileModalStore,
  } from "../../../../store";
  import { page } from "$app/stores";
  import { onDestroy } from "svelte";

  export let key: string;
  export let value: Profile;

  let isClicked: boolean = false;

  const requestData: SetRequestDTO = {
    roomId: $page.url.searchParams.get("id") as string,
    userId: $myData.id,
    targetId: value.user.id,
  };

  const menuShowEvent = () => {
    isClicked = !isClicked;
  };

  const profileClickEvent = () => {
    $profileModalStore = value.user;
    $modalStatesStore.isProfileModal = true;
  };

  const adminClickEvent = () => {
    if (value.level === Level.MEMBER) {
      $socketStore.emit("chat/set-admin", requestData);
    } else if (value.level === Level.ADMIN) {
      $socketStore.emit("chat/unset-admin", requestData);
    }
  };

  const muteClickEvent = () => {
    if ($openedRoom.myLevel === Level.MEMBER) return;
    if ($openedRoom.myLevel === Level.ADMIN && value.level !== Level.MEMBER)
      return;
    if (!value.isMuted) {
      $socketStore.emit("chat/set-mute", requestData);
    } else {
      $socketStore.emit("chat/unset-mute", requestData);
    }
  };

  const kickClickEvent = () => {
    /*
			@TODO
			강퇴 SOCKET 요청
		*/
    if ($openedRoom.myLevel === Level.MEMBER) return;
    if ($openedRoom.myLevel === Level.ADMIN && value.level !== Level.MEMBER)
      return;
    $socketStore.emit("chat/set-kick", requestData);
  };

  onDestroy(() => {
    isClicked = false;
  });
</script>

<div class="other-profile">
  <button on:click={menuShowEvent} class="profile-button">
    <div class="image-container">
      <img src={value.user.avatar} alt="프로필 이미지" class="profile-photo" />
    </div>
    <div class="profile-id">
      {value.user.nickname}
    </div>
    {#if value.isMuted}
      <div><i class="fa-solid fa-volume-xmark" /></div>
    {:else}
      <div />
    {/if}
    {#if value.level == Level.HOST}
      <div class="host"><i class="fa-solid fa-crown" /></div>
    {:else if value.level == Level.ADMIN}
      <div><i class="fa-solid fa-screwdriver-wrench" /></div>
    {:else if value.level == Level.MEMBER}
      <div />
    {/if}
  </button>
  {#if isClicked}
    <div class="menu-list">
      <button on:click={profileClickEvent}>PROFILE</button>
      {#if $openedRoom.myLevel === Level.HOST}
        <button on:click={adminClickEvent}>ADMIN</button>
      {/if}
      {#if $openedRoom.myLevel === Level.HOST || ($openedRoom.myLevel === Level.ADMIN && value.level === Level.MEMBER)}
        <button on:click={muteClickEvent}>MUTE</button>
        <button on:click={kickClickEvent}>KICK</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .host {
    color: var(--point-color);
  }

  .profile-button {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
    padding: 4px 10px 4px 10px;

    box-sizing: border-box;
    margin-bottom: 5px;
  }

  .profile-id {
    font-size: 12px;
  }

  .profile-button > :nth-child(2) {
    /* width: 100%; */
    flex-basis: 120px;
    padding-left: 10px;
    text-align: left;
  }

  .profile-button > :nth-child(3) {
    flex-basis: 20px;
    text-align: center;
    padding-right: 10px;
  }

  .profile-button > :nth-child(4) {
    flex-basis: 20px;
  }

  .menu-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 5% 5% 5%;
  }

  .menu-list > button {
    width: 49%;
    font-size: 12px;
    margin-bottom: 2%;
  }

  .profile-photo {
    border-radius: 70%;
    width: 20px;
    height: 20px;
  }

  .image-container {
    display: flex;
    justify-content: center;
  }
</style>
