<script lang="ts">
    import NotiModal from './NotiModal.svelte';
    import { modalStatesStore } from '../../store';
</script>

<div class="container">
    <nav class= "containerTop" >
        <a href="/" >GAME</a>
        <a href="/chat" >CHAT</a> 
        <a href="/profile" >PROFILE</a>
    </nav>
    <div class="containerBody">
        <slot></slot>
    </div>
</div>
<div class="alarm">
    <button on:click={() => { $modalStatesStore.isNotiModal = true; }}>
        &#x1F4E2;
    </button>
</div>
<NotiModal />

<style>
    @import url('https://rsms.me/inter/inter.css'); /* font */
    :global(*) { 
        font-family: 'Inter', sans-serif;
        font-weight: 200;
        font-size: 16px;
    }

    :root {
        --bg-color: #424242;
        --text-color: #d2d2d2;
        --border-color: #848484;
        --point-color: #FF6231;
        --hover-color: rgba(255, 98, 49, 0.4);
        --intra-color: #00BABC;
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
    }

    .alarm {
        position: absolute;
        top: 5px;
        left: 50%;
        margin-left: 595px;
    }

    .alarm > button {
        border: none;
    }

    .alarm > button:hover {
        background-color: var(--bg-color);
    }

    :global(button) {
        height: 30px;
        background-color: var(--bg-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
    }

    :global(button:hover) {
        background-color: var(--hover-color);
    }

    .container {
        width: 800px;
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .containerBody {
		width: 800px;
		height: 650px;
		margin-top: 80px;
        border: 1px solid red;
	}

    nav {
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    nav > a {
        color: var(--text-color);
        padding: 10px 10px 10px 10px;
        text-decoration: none;
    }

    nav > a:hover {
        color: var(--point-color);
        padding: 10px 10px 10px 10px;
        text-decoration: none;
    }

    /* .icon-transform {
        transform: scale(1.2);
    } */


</style>
