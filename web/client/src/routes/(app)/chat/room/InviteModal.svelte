<script lang="ts">
  import {
    apiUrl,
    modalStatesStore,
    myData,
    openedRoom,
    socketStore,
  } from "../../../../store";
  import { clickOutside, escapeKey } from "../../../../actions";
  import type {
    AlertData,
    OtherUserData,
    UserData,
  } from "../../../../interfaces";
  import { AlertType } from "../../../../enums";
  import { page } from "$app/stores";

  let isInviteButtonActivated: boolean = false;
  let isBanUser: boolean = false;
  let inputValue: string = "";
  let receiver: UserData;

  const inviteButtonEvent = () => {
    if (receiver === undefined) return;

    const data: AlertData = {
      alertType: AlertType.CHAT_INVITE,
      sender: $myData,
      receiver: receiver,
      roomId: $page.url.searchParams.get("id") as string,
    };
    $socketStore.emit("alert/chat", data);
    inputValue = "";
    $modalStatesStore.isInviteModal = false;
  };

  const inputEvent = async (e: any) => {
    e.target.value = e.target.value.replace(/\s/g, "");
    inputValue = e.target.value;
    isBanUser = false;

    const isUser = await isUserExistAPI(inputValue);
    if (inputValue !== "" && isUser) {
      isInviteButtonActivated = true;
    } else {
      isInviteButtonActivated = false;
    }
    if (isBanUser) {
      isInviteButtonActivated = false;
    }
  };

  const isUserExistAPI = async (nickname: string): Promise<boolean> => {
    const isAlreayRoom: boolean = Array.from($openedRoom.members.values()).some(
      (member) => member.user.nickname === nickname
    );

    if (
      nickname === "" ||
      nickname === $myData.nickname ||
      isAlreayRoom ||
      nickname.length < 3
    ) {
      return false;
    }
    try {
      const response = await fetch(
        `${apiUrl}/api/user/search?nickname=${nickname}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.exist) {
        receiver = data.user;
        if ($openedRoom.banList.includes(Number(receiver.id))) {
          isBanUser = true;
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("실패:", error);
      return false;
    }
  };

  const initialInput = () => {
    inputValue = "";
    isInviteButtonActivated = false;
    isBanUser = false;
  };
</script>

<div
  class="modal-container"
  style={$modalStatesStore.isInviteModal ? "display: block;" : "display: none;"}
  use:clickOutside
  on:outclick={() => {
    initialInput();
    $modalStatesStore.isInviteModal = false;
  }}
  use:escapeKey
  on:esckey={() => {
    initialInput();
    $modalStatesStore.isInviteModal = false;
  }}
>
  <div class="modal-title">
    <div>INVITE FRIEND</div>
    <button
      class="close-button"
      on:click={() => {
        $modalStatesStore.isInviteModal = false;
        initialInput();
      }}><i class="fa-solid fa-circle-xmark" /></button
    >
  </div>
  <div class="modal-content">
    <div class="find-friend">
      <div class="find-friend-input">
        <input
          type="text"
          placeholder="FIND FRIEND"
          bind:value={inputValue}
          on:input={inputEvent}
          maxlength="10"
        />
      </div>
    </div>
    <div class="bottom-line">
      <div class="find-result">
        {#if !isInviteButtonActivated && !isBanUser}
          <div class="invite-check">unavailable</div>
        {:else}
          <div class="profile-container">
            <div class="image-container">
              <img
                class="profile-photo"
                src={receiver.avatar}
                alt={`${receiver.nickname}'s profile image`}
              />
            </div>
            <div>
              {receiver.nickname}
            </div>

            {#if isBanUser}
              <div class="banDisplay">(ban)</div>
            {/if}
          </div>
        {/if}
      </div>
      <button
        class={isInviteButtonActivated
          ? "make-button able"
          : "make-button disable"}
        on:click={inviteButtonEvent}
        disabled={isInviteButtonActivated ? false : true}
      >
        INVITE
      </button>
    </div>
  </div>
</div>

<style>
  .modal-container {
    position: absolute;
    top: 100px;
    left: 50%;
    margin-left: -365px;
    width: 537px;
    height: 140px;

    display: flex;

    justify-content: center;
    align-items: center;

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
    margin-top: 15px;
    margin-bottom: 10px;
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

  .find-friend {
    width: 310px;
    display: flex;
    flex-direction: row;
    border: 1px solid var(--border-color);
    margin-left: 20px;
  }

  .find-friend-input > input {
    width: 260px;
    height: 35px;
    background-color: var(--dark-color);
    border: none;
    outline: none;
    color: var(--font-color);
    margin-left: 10px;
  }

  .bottom-line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 20px;
    margin-top: 10px;
  }

  .invite-check {
    display: flex;
    flex-direction: column;
    justify-content: top;

    width: 320px;
    height: 35px;
    background-color: var(--dark-color);
    color: var(--border-color);

    margin-left: 5px;
  }

  .make-button {
    text-align: center;
    width: 100px;
    border: 1px solid var(--border-color);
    margin-right: 20px;
    background-color: var(--dark-color);
  }

  .make-button.able:hover {
    background-color: var(--hover-color);
  }

  .make-button.disable {
    color: var(--border-color);
  }

  .make-button.disable:hover {
    background-color: var(--dark-color);
  }

  .profile-container {
    display: flex;
    flex-direction: row;
    align-items: top;

    height: 35px;
  }

  .profile-photo {
    border-radius: 70%;
    width: 20px;
    height: 20px;

    margin-left: 3px;
    margin-right: 5px;
  }

  .image-container {
    display: flex;
    justify-content: center;
  }

  .banDisplay {
    color: red;
    margin-left: 5px;
    font-weight: bold;
  }
</style>
