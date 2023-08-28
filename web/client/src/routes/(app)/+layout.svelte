<script lang="ts">
  import NotiModal from "./NotiModal.svelte";
  import { apiUrl, modalStatesStore, myData, socketStore } from "../../store";
  import type { MyData } from "../../interfaces";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let isSigned: boolean = false;
  let isAlert: boolean = false;

  onMount(() => {
    getMyData();
    $socketStore.on("alert", () => {
      isAlert = true;
    });
    $socketStore.on("app/disconnect-another-user", () => {
      alert("Account in use by another user. Session will be terminated.");
      goto("/signin");
    });
  });

  const getMyData = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiUrl}/api/user/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        goto("/signin");
        return;
      }
      const data: Promise<MyData> = response.json();
      $myData = await data;

      if ($myData.nickname) {
        isSigned = true;
        isAlert = $myData.isAlert;
        $socketStore.connect();
      } else {
        goto("/join");
      }
    } catch (error) {
      console.error("실패:", error);
    }
  };

  const alertButtonClickEvent = async (): Promise<void> => {
    const response = await fetch(`${apiUrl}/api/alert/state`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { state: false } }),
    })
      .then(() => {
        $modalStatesStore.isNotiModal = true;
        isAlert = false;
      })
      .catch((error) => {
        console.error(error);
      });
  };
</script>

{#if isSigned}
  <div class="container">
    <nav class="containerTop">
      <a href="/">GAME</a>
      <a href="/chat">CHAT</a>
      <a href="/social">SOCIAL</a>
      <a href="/profile">{$myData.nickname}</a>
    </nav>
    <div class="containerBody">
      <slot />
    </div>
  </div>
  <div class="alarm">
    {#if isAlert}
      <div class="new-alert" />
    {/if}
    <button on:click={alertButtonClickEvent}
      ><i class="fa-solid fa-bell" /></button
    >
  </div>
  {#if $modalStatesStore.isNotiModal}
    <NotiModal />
  {/if}
{/if}

<style>
  @import url("https://rsms.me/inter/inter.css"); /* font */
  :global(*) {
    font-family: "Inter", sans-serif;
    font-weight: 200;
    font-size: 16px;
  }

  :global(img) {
    -webkit-user-drag: none;
  }

  :root {
    --bg-color: #424242;
    --text-color: #d2d2d2;
    --border-color: #848484;
    --point-color: #ff6231;
    --hover-color: rgba(255, 98, 49, 0.4);
    --intra-color: #00babc;
    --dark-color: #3e3e3e;
  }

  :global(body) {
    background-color: var(--bg-color);
    color: var(--text-color);
    width: 100vw;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-sizing: border-box;
  }

  :global(button) {
    height: 30px;
    background-color: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    outline: none;
  }

  :global(button:hover) {
    background-color: var(--hover-color);
  }

  .alarm {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 880px;
    height: 50px;
    position: absolute;
    z-index: 0;
    margin-top: 130px;
  }

  .alarm > button {
    border: 1px solid var(--border-color);
    border-radius: 70%;
    text-align: center;
    width: 30px;
    height: 30px;
  }

  .new-alert {
    background-color: var(--point-color);
    width: 10px;
    height: 10px;
    border-radius: 100px;
    position: absolute;
    top: 10px;
    right: 0px;
  }

  .container {
    width: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
  }

  .containerBody {
    width: 800px;
    height: 650px;
    margin-top: 80px;
  }

  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;

    height: 50px;
  }

  nav > a {
    width: 100px;
    color: var(--text-color);
    padding: 10px 10px 10px 10px;
    text-decoration: none;
  }

  nav > a:hover {
    color: var(--point-color);
    padding: 10px 10px 10px 10px;
    text-decoration: none;
  }
</style>
