<script lang="ts">
  import ChatRoomCreateModal from "./ChatRoomCreateModal.svelte";
  import ChatRoomEnterPasswordModal from "./ChatRoomEnterPasswordModal.svelte";
  import {
    apiUrl,
    blacklist,
    modalStatesStore,
    myData,
    roomList,
    socketStore,
  } from "../../../store";
  import type { Room } from "../../../interfaces";
  import { onMount } from "svelte";
  import { RoomType } from "../../../enums";
  import { goto } from "$app/navigation";

  let selectedRoomId: string;

  onMount(() => {
    $modalStatesStore.isRoomCreateModal = false;
    getRoomList();
    getBlackList();
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

  const getRoomList = async () => {
    const response = await fetch(`${apiUrl}/api/chat/list`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      $roomList.clear();
      for (let i = 0; i < data.rooms.length; i++) {
        const element = data.rooms[i];
        $roomList.set(Number(element.roomId), element);
      }
      $roomList = $roomList;
    })
    .catch((error) => console.error("Error:", error));
  };

  const postRoomEnter = (roomId: string, password: string) => {
    const data = {
      data: {
        roomId,
        password,
      },
    };
    const response = fetch(`${apiUrl}/api/chat/room/enter`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 403) {
          alert("wrong password!");
        } else if (response.status === 201) {
          $modalStatesStore.isPasswordInputModal = false;
          goto(`/chat/room?id=${roomId}`);
          $socketStore.emit("chat/enter", { roomId, userId: $myData.id });
        } else if (response.status === 406) {
          alert("You can't enter the room.");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const roomCreateModalButton = () => {
    $modalStatesStore.isRoomCreateModal = true;
  };

  const passwordInputModalButton = () => {
    $modalStatesStore.isPasswordInputModal = true;
  };

  const roomEnter = (room: Room) => {
    if (room.roomtype === RoomType.LOCK) {
      selectedRoomId = room.roomId;
      passwordInputModalButton();
    } else {
      postRoomEnter(room.roomId, "");
    }
  };

  const myRoomEnter = (roomNum: number) => {
    if ($myData.rooms.includes(roomNum)) {
      goto(`/chat/room?id=${roomNum}`);
      return;
    }
  };
</script>

<ChatRoomEnterPasswordModal {postRoomEnter} {selectedRoomId} />

<ChatRoomCreateModal />

<div class="chatroom-box">
  <div class="chat-title">
    <div>CHAT ROOM LIST</div>
    <div>
      <button class="plus-button" on:click={roomCreateModalButton}
        ><i class="fa-solid fa-square-plus" /></button
      >
    </div>
  </div>
  <div class="room-list">
    {#each $myData.rooms as roomNum}
      {#if $roomList.get(roomNum) !== undefined}
        <button on:click={() => myRoomEnter(roomNum)}>
          <div>
            {$roomList.get(roomNum)?.roomname}
          </div>
          {#if $roomList.get(roomNum)?.roomtype === RoomType.LOCK}
            <div><i class="fa-solid fa-lock" /></div>
          {:else}
            <div />
          {/if}
          <div>
            {$roomList.get(roomNum)?.memberCount}
          </div>
        </button>
      {/if}
    {/each}
    {#if $myData.rooms.length > 0}
      <div class="divider" />
    {/if}
    {#each $roomList as room}
      {#if !$myData.rooms.includes(Number(room[1].roomId))}
        <button on:click={() => roomEnter(room[1])}>
          <div>
            {room[1].roomname}
          </div>
          {#if room[1].roomtype === RoomType.LOCK}
            <div><i class="fa-solid fa-lock" /></div>
          {:else}
            <div />
          {/if}
          <div>
            {room[1].memberCount}
          </div>
        </button>
      {/if}
    {/each}
  </div>
</div>

<style>
  .plus-button:active {
    padding-top: 0.2rem;
  }

  .chatroom-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .room-list {
    width: 800px;
    height: 570px;
    overflow-y: auto;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .room-list::-webkit-scrollbar {
    width: 6px;
    height: 30px;
  }

  .room-list::-webkit-scrollbar-track {
    background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
  }

  .room-list::-webkit-scrollbar-thumb {
    background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
    border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
  }

  .room-list::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-color); /* 스크롤바 썸바 호버 배경색 설정 */
  }

  .chat-title {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 800px;
    height: 80px;
  }

  .chat-title > :nth-child(1) {
    text-align: center;
  }

  .chat-title > :nth-child(2) > button {
    position: absolute;
    right: 10px;
    top: 25px;
    background-color: var(--bg-color);
    border: none;
  }

  .room-list > button {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    height: 50px;
    width: 380px;
    margin-right: 10px;
    margin-bottom: 10px;
    outline: none;
    border: 1px solid var(--border-color);
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  .room-list > button > div {
    height: 20px;
  }

  .room-list > button > :nth-child(1) {
    padding-left: 20px;
  }

  .room-list > button > :nth-child(2) {
    padding-left: 15px;
  }

  .room-list > button > :nth-child(3) {
    flex-grow: 10;
    text-align: right;
    padding-right: 20px;
  }

  .room-list > button:hover {
    background-color: var(--hover-color);
  }

  .divider {
    width: 770px;
    height: 20px;
  }
</style>
