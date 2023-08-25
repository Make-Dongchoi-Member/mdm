<script lang="ts">
  import { myData, openedRoom } from "../../../../store";
  import ProfileButton from "./ProfileButton.svelte";
  import { Level } from "../../../../enums";
</script>

<div class="members">
  <div class="my-profile">
    <div class="image-container">
      <img src={$myData.avatar} alt="프로필 이미지" class="profile-photo" />
    </div>
    <div class="profile-id">
      {$myData.nickname}
    </div>
    {#if $openedRoom.members.get(`${$myData.id}`)?.isMuted}
      <div><i class="fa-solid fa-volume-xmark" /></div>
    {:else}
      <div />
    {/if}
    {#if $openedRoom.myLevel === Level.HOST}
      <div class="host"><i class="fa-solid fa-crown" /></div>
    {:else if $openedRoom.myLevel === Level.ADMIN}
      <div><i class="fa-solid fa-screwdriver-wrench" /></div>
    {:else if $openedRoom.myLevel === Level.MEMBER}
      <div />
    {/if}
  </div>
  <div class="other-profile-container">
    {#each Array.from($openedRoom.members) as [key, value]}
      {#if key != $myData.id}
        <ProfileButton {key} {value} />
      {/if}
    {/each}
  </div>
</div>

<style>
  .host {
    color: var(--point-color);
  }

  .members {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 220px;
    height: 570px;
    border: 1px solid var(--border-color);
    font-size: 12px;
    box-sizing: border-box;
  }

  .profile-id {
    font-size: 12px;
  }

  .my-profile {
    width: 90%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
    padding: 4px 10px 4px 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .my-profile > :nth-child(2) {
    width: 100%;
    padding-left: 10px;
  }

  .my-profile > :nth-child(3) {
    padding-right: 10px;
  }

  .other-profile-container {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 500px;
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
