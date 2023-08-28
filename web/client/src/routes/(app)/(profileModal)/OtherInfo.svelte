<script lang="ts">
  import MatchStat from "./MatchStat.svelte";
  import {
    apiUrl,
    gameSettingStore,
    modalStatesStore,
    myData,
    socketStore,
  } from "../../../store";
  import type { AlertData, OtherUserData } from "../../../interfaces";
  import { AlertType, Relation } from "../../../enums";
  import { goto } from "$app/navigation";
  import { onDestroy, onMount } from "svelte";

  export let user: OtherUserData;
  let isfollowchecked: boolean = false;
  let isplaywithchecked: boolean = false;

  onMount(() => {
    $socketStore.on("alert/redirect", () => {
      goto("/");
    });
  });

  onDestroy(() => {
    $socketStore.off("alert/redirect");
    $modalStatesStore.isProfileModal = false;
  });

  const sendFollow = async () => {
    isfollowchecked = true;
    if (user.relation === Relation.BLOCK) return;
    if (user.relation !== Relation.FRIEND) {
      const data: AlertData = {
        sender: $myData,
        receiver: user,
        alertType: AlertType.FRIEND_REQUEST,
      };
      $socketStore.emit("alert/follow", data);
    } else {
      const response = fetch(`${apiUrl}/api/user/friend/delete`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { nickname: user.nickname } }),
      })
        .then((response) => {
          if (response.ok) {
            user.relation = Relation.NONE;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const sendGame = async () => {
    isplaywithchecked = true;
    if (user.relation === Relation.BLOCK) return;
    const data: AlertData = {
      sender: $myData,
      receiver: user,
      alertType: AlertType.GAME_REQUEST,
      gameSetting: $gameSettingStore,
    };
    $socketStore.emit("alert/game", data);
  };

  const sendBlock = async () => {
    const data = {
      data: {
        nickname: user.nickname,
      },
    };
    const endPoint = user.relation === Relation.BLOCK ? "cancel" : "request";
    const response = fetch(`${apiUrl}/api/user/block/${endPoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          user.relation =
            user.relation === Relation.BLOCK ? Relation.NONE : Relation.BLOCK;
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
</script>

<div class="personal_box">
  <button type="button" class="profile_image_circle" disabled>
    <img class="image" src={user.avatar} alt="profile_image" />
  </button>
  <div class="personal_info">
    <button disabled>
      {user ? user.nickname : ""}
    </button>
    <button disabled>
      {user ? user.state?.toUpperCase() : ""}
    </button>
  </div>
</div>
<div class="stat_box">
  <MatchStat records={user.record} />
</div>
<div class="option_box">
  <button disabled={user.relation === Relation.BLOCK} on:click={sendFollow}>    
      {#if isfollowchecked && user.relation !== Relation.FRIEND && user.relation !== Relation.BLOCK}
        <div class="follow-checked"><i class="fa-solid fa-check" /></div>
      {:else}
       <div>{user.relation === Relation.FRIEND ? "UNFOLLOW" : "FOLLOW"}</div>
      {/if}    
  </button>
  <button disabled={user.relation === Relation.BLOCK} on:click={sendGame}>    
      {#if isplaywithchecked && user.relation !== Relation.BLOCK}
        <div class="playwith-checked"><i class="fa-solid fa-check" /></div>
      {:else}
        <div>PLAY WITH</div>
      {/if}    
  </button>
  <button on:click={sendBlock}>
    {user.relation === Relation.BLOCK ? "UNBLOCK" : "BLOCK"}
  </button>
</div>

<style>
  .personal_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
  }

  .stat_box {
    display: flex;
    flex-direction: column;
    width: 50%;
  }

  .option_box {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 25%;
    flex-grow: 1;
  }

  .option_box > button {
    width: 150px;
    height: 40px;
    margin-bottom: 20px;
    background-color: var(--dark-color);    
  }

  .option_box > button:hover {
    background-color: var(--hover-color);
  }

  .option_box > button:disabled {
    color: var(--border-color);
    background-color: var(--bg-color);
  }

  .profile_image_circle {
    width: 120px;
    height: 120px;
    border: 1px solid var(--border-color);
    border-radius: 70%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: 20px;
  }

  .profile_image_circle > .image {
    width: 115%;
    height: 115%;
    object-fit: cover;
  }

  .personal_info {
    width: 150px;
    height: 80px;
    display: flex;
    flex-direction: column;
  }

  .personal_info > button {
    width: 150px;
    margin-bottom: 10px;
    background-color: var(--dark-color);
  }

  .follow-checked, .playwith-checked  {
    color: var(--point-color);
    margin-left: 5px;    
  }
  
</style>
