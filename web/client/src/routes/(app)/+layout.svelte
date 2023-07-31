<script lang="ts">
	import NotiModal from './NotiModal.svelte';
	import { modalStatesStore, myData } from '../../store';
</script>

<div class="container">
	<nav class= "containerTop" >
		<a href="/" >GAME</a>
		<a href="/chat" >CHAT</a> 
		<a href="/profile" >{$myData.id}</a>
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

	:global(img) {
		-webkit-user-drag: none;
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
		width: 900px;
		position: absolute;
		top: 7px;
		z-index: 0;
	}

	.alarm > button {
		padding-right: 10px;
		border: none;
	}

	.alarm > button:hover {
		background-color: var(--bg-color);
	}

	.container {
		width: 800px;
		border: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		justify-content: center;
		z-index: 1;
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
		text-align: center;
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

	/* .icon-transform {
		transform: scale(1.2);
	} */
</style>
