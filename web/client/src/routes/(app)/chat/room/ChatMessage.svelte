<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { myData, openedRoom, socketStore, blacklist } from "../../../../store";
  import type { Message } from "../../../../interfaces";
  import { page } from "$app/stores";

  let inputValue: string = "";

  onMount(() => {
    document.body.addEventListener("keypress", enterKeyPressEvent);

    $socketStore.on("chat/message", (data: { message: Message }) => {
      data.message.date = new Date(data.message.date);
      pushNewMessage(data.message);
    });
    scrollAndFocus();
  });

  onDestroy(() => {
    document.body.removeEventListener("keypress", enterKeyPressEvent);
    $socketStore.off("chat/message");
  });

  const enterKeyPressEvent = (e: any) => {
    if (e.code === "Enter") {
      sendButtonEvent();
    }
  };

  const sendButtonEvent = () => {
    if (inputValue === "") return;
    if ($openedRoom.members.get(`${$myData.id}`)?.isMuted) return;

    const message: Message = {
      sender: {
        id: $myData.id,
        avatar: $myData.avatar,
        nickname: $myData.nickname,
      },
      roomId: $page.url.searchParams.get("id") as string,
      body: inputValue,
      isDM: false,
      date: new Date(),
    };
    $socketStore.emit("chat/message", { message });
    inputValue = "";
    pushNewMessage(message);
  };

  const pushNewMessage = (message: Message) => {
    $openedRoom.history = [...$openedRoom.history, message];
    scrollAndFocus();
  };

  const scrollAndFocus = () => {
    setTimeout(() => {
      const chattingBox = document.querySelector(
        ".chatting-box"
      ) as HTMLDivElement;
      chattingBox.scrollTop = chattingBox.scrollHeight;
      const inputTag = document.querySelector(
        "#chat-input"
      ) as HTMLInputElement;
      inputTag.focus();
    }, 1);
  };

  function formatDateToTimeString(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // 시간과 분이 10 미만인 경우 앞에 '0'을 붙여 두 자릿수로 만든다.
    const hoursStr: string = `${hours < 10 ? "0" + hours : hours}`;
    const minutesStr: string = `${minutes < 10 ? "0" + minutes : minutes}`;

    return hoursStr + ":" + minutesStr;
  }
</script>

<div class="chat-main-box">
  <div class="chatting-box">
    {#each $openedRoom.history as message}
      {#if !$blacklist.includes(Number(message.sender.id))}
      <div
        class={$myData.nickname === message.sender.nickname
          ? "chatting my-message"
          : "chatting"}
      >
        <div>
          <img
            src={message.sender.avatar}
            alt="Profile"
            class="chatting-box-avatar"
          />
        </div>
        <div>
          <div>
            <div>
              {message.sender.nickname}
            </div>
            <div>
              {formatDateToTimeString(message.date)}
            </div>
          </div>
          <div>
            {message.body}
          </div>
        </div>
      </div>
      {/if}
    {/each}
  </div>
  <div class="chat-send-box">
    <input
      bind:value={inputValue}
      id="chat-input"
      type="text"
      placeholder="chat here"
    />
    <button on:click={sendButtonEvent} class="send-button">
      <i class="fa-solid fa-circle-up" />
    </button>
  </div>
</div>

<style>
  .send-button:active {
    padding-top: 0.2rem;
  }

  .chat-main-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 560px;
    height: 570px;
    border: 1px solid var(--border-color);
    box-sizing: border-box;
  }

  .chatting-box-avatar {
    border-radius: 50px;
    width: 40px;
    height: 40px;

    margin-right: 10px;
  }

  .chatting-box {
    width: 100%;
    height: 500px;
    overflow-y: auto;
  }

  .chatting-box::-webkit-scrollbar {
    width: 6px;
    height: 30px;
  }

  .chatting-box::-webkit-scrollbar-track {
    background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
  }

  .chatting-box::-webkit-scrollbar-thumb {
    background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
    border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
  }

  .chatting-box::-webkit-scrollbar-thumb:hover {
    background-color: var(--text-color); /* 스크롤바 썸바 호버 배경색 설정 */
  }

  .chatting {
    display: flex;
    flex-direction: row;
    text-align: left;
    word-break: break-all;
    margin: 20px;
  }

  .chatting > div:nth-child(2) {
    display: flex;
    flex-direction: column;
  }

  .chatting > div:nth-child(2) > div:nth-child(1) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .chatting > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
    font-size: 15px;
    font-weight: 400;
    margin-right: 10px;
  }

  .chatting > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) {
    font-size: 14px;
    font-weight: 300;
    margin-right: 10px;
  }

  .my-message {
    color: var(--point-color);
  }

  .chat-send-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
    height: 40px;
    margin-top: 15px;
    margin-bottom: 15px;
    width: 95%;
    box-sizing: border-box;
  }

  .chat-send-box > input {
    width: 470px;
    height: 27px;
    background-color: var(--bg-color);
    border: none;
    color: var(--font-color);
    margin-left: 10px;
    outline: none;
  }

  .send-button {
    width: 40px;
    background-color: var(--bg-color);
    text-align: center;
    border: none;
    box-sizing: border-box;
  }
</style>
