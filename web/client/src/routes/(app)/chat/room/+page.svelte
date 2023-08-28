<script lang="ts">
  import InviteModal from "./InviteModal.svelte";
  import SettingModal from "./SettingModal.svelte";
  import RoomoutModal from "./RoomoutModal.svelte";
  import {
    modalStatesStore,
    socketStore,
    myData,
    openedRoom,
    apiUrl,
    blacklist,
  } from "../../../../store";
  import ChatMessage from "./ChatMessage.svelte";
  import ChatMember from "./ChatMember.svelte";
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { Level, RoomType } from "../../../../enums";
  import { goto } from "$app/navigation";
  import type { Message, Profile, SetRequestDTO } from "../../../../interfaces";
  import ProfileModal from "../../(profileModal)/ProfileModal.svelte";

  let roomNameInputValue: string = $openedRoom.roomId;
  let roomtype: RoomType = $openedRoom.roomtype;
  let isPrivate: boolean = $openedRoom.roomtype === RoomType.PRIVATE;
  let isPassword: boolean = $openedRoom.roomtype === RoomType.LOCK;
  let passwordInput: string =
    $openedRoom.roomtype === RoomType.LOCK ? "initialpw" : "";

  onMount(() => {
    getBlackList();
    getRoomData();
    $socketStore.emit("chat/join", {
      userId: $myData.id,
      roomId: $page.url.searchParams.get("id"),
    });

    $socketStore.on("chat/enter", (data: any) => {
      getRoomData();
    });

    $socketStore.on("chat/out", (data: any) => {
      getRoomData();
    });

    $socketStore.on("chat/set-kick", (data: any) => {
      if ($myData.id === data.targetId) {
        $myData.rooms = $myData.rooms.filter(
          (room) => String(room) !== $page.url.searchParams.get("id")
        );
        $myData = $myData;
        goto("/chat");
      } else {
        getRoomData();
      }
    });

    $socketStore.on("chat/set-admin", (data: SetRequestDTO) => {
      getRoomData();
    });

    $socketStore.on("chat/unset-admin", (data: SetRequestDTO) => {
      getRoomData();
    });

    $socketStore.on("chat/set-mute", (data: SetRequestDTO) => {
      getRoomData();
    });

    $socketStore.on("chat/unset-mute", (data: SetRequestDTO) => {
      getRoomData();
    });
  });

  onDestroy(() => {
    $socketStore.off("chat/enter");
    $socketStore.off("chat/out");
    $socketStore.off("chat/set-kick");
    $socketStore.off("chat/set-admin");
    $socketStore.off("chat/unset-admin");
    $socketStore.off("chat/set-mute");
    $socketStore.off("chat/unset-mute");
  });

  const getBlackList = async () => {
    const response = await fetch(`${apiUrl}/api/user/blacklist`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      $blacklist = data.blackList;
    });
  }

  const getRoomData = async () => {
    const response = await fetch(
      `${apiUrl}/api/chat/room?room_id=${$page.url.searchParams.get("id")}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            alert(`room${$page.url.searchParams.get("id")} not found`);
          } else if (response.status === 403) {
            alert(`You do not have permission`);
          }
          goto("/chat");
          throw Error;
        }
        myDataUpdate(Number($page.url.searchParams.get("id")) as number);
        return response.json();
      })
      .then((data) => {
        $openedRoom.hostId = data.openedRoom.hostId;
        $openedRoom.roomId = data.openedRoom.roomId;
        $openedRoom.roomname = data.openedRoom.roomname;
        $openedRoom.roomtype = data.openedRoom.roomtype;
        $openedRoom.history = data.openedRoom.history.map((m: any): Message => {
          m.date = new Date(m.date);
          return m;
        });
        $openedRoom.memberCount = data.openedRoom.memberCount;
        $openedRoom.members = new Map(
          Object.entries(JSON.parse(data.openedRoom.members))
        );
        $openedRoom.banList = data.openedRoom.banList;
        $openedRoom.myLevel = (
          $openedRoom.members.get(`${$myData.id}`) as Profile
        ).level;
        $openedRoom = $openedRoom;
      })
      .catch((error) => console.error("Error:", error));
  };

  onDestroy(() => {
    $socketStore.emit("chat/leave", {
      userId: $myData.id,
      roomId: $page.url.searchParams.get("id"),
    });
  });

  const myDataUpdate = (roomId: number) => {
    if ($myData.rooms.includes(roomId)) return;
    $myData.rooms = [...$myData.rooms, roomId];
  };

  const changeSetting = () => {
    roomNameInputValue = $openedRoom.roomname;
    roomtype = $openedRoom.roomtype;
    isPrivate = $openedRoom.roomtype === RoomType.PRIVATE;
    isPassword = $openedRoom.roomtype === RoomType.LOCK;
    passwordInput = $openedRoom.roomtype === RoomType.LOCK ? "initialpw" : "";
    $modalStatesStore.isSettingModal = true;
  };
</script>

{#if $modalStatesStore.isProfileModal}
  <ProfileModal />
{/if}
<InviteModal />
<SettingModal
  {roomNameInputValue}
  {roomtype}
  {isPrivate}
  {isPassword}
  {passwordInput}
/>
<RoomoutModal />

<div class="chat-box">
  <div class="chatroom-top-box">
    <div class="chatroom-left-top-box">
      <div class="back-button">
        <a href="/chat"><i class="fa-solid fa-chevron-left" /></a>
      </div>
      <div class="chat-room-name">
        {$openedRoom.roomname}
      </div>
      {#if $openedRoom.myLevel === Level.HOST}
        <div class="chat-setting-button">
          <button class="gear-button" on:click={changeSetting}
            ><i class="fa-solid fa-gear" /></button
          >
        </div>
      {:else}
        <div class="chat-setting-button" />
      {/if}
      <div class="invite-button">
        <button
          class="plus-button"
          on:click={() => {
            $modalStatesStore.isInviteModal = true;
          }}><i class="fa-solid fa-user-plus" /></button
        >
      </div>
    </div>
    <div class="out-of-room-button">
      <button
        class="room-out-button"
        on:click={() => {
          $modalStatesStore.isRoomoutModal = true;
        }}><i class="fa-solid fa-arrow-right-from-bracket" /></button
      >
    </div>
  </div>
  <div class="chatroom-bottom-box">
    <ChatMessage />
    <ChatMember />
  </div>
</div>

<style>
  .room-out-button:active,
  .plus-button:active,
  .gear-button:active {
    padding-top: 0.2rem;
  }

  .chatroom-top-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 50px;

    padding-top: 30px;
  }

  .chatroom-left-top-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 560px;
  }

  .chat-room-name {
    flex-grow: 1;
    text-align: left;
    margin-left: 10px;
  }

  .chat-setting-button {
    flex-grow: 1;
  }

  .back-button {
    flex-grow: 1;
    margin-left: 10px;
  }

  .back-button > a {
    text-decoration: none;
    color: var(--text-color);
  }

  .invite-button {
    flex-grow: 30;
    text-align: right;
  }

  .invite-button > button,
  .out-of-room-button > button,
  .chat-setting-button > button {
    background-color: var(--bg-color);
    color: var(--text-color);
    border: none;
    outline: none;
  }

  .chatroom-bottom-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 570px;
  }
</style>
