<script lang="ts">
	import Modal from './ChatRoomCreateModal.svelte';
	import { modalStatesStore, myData } from '../../../store';
	import { onMount } from 'svelte';
	import { RoomType } from '../../../enums';
	import type { Room } from '../../../interfaces';

	let roomlist: Map<number, Room> = new Map();
		
	onMount(() => {
		getRoomList();
		

	});

	const getRoomList = async () => {
		const response = await fetch(`http://localhost:3000/api/chat/list`, {
			method: "GET",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(response => response.json())
		.then(data => {
			console.log(data.rooms);
			
			for (let i = 0; i < data.rooms.length; i++) {
				const element = data.rooms[i];
				roomlist.set(element.id, element);
			}
			roomlist = roomlist;
		})
		.catch(error => console.error('Error:', error));
	}

	const roomCreateModalButton = () => {
		$modalStatesStore.isRoomCreateModal = true;
	}
</script>

{#if $modalStatesStore.isRoomCreateModal}
	<Modal />
{/if}

<div class="chatroom-box">
	<div class="chat-title">
		<div>
			CHAT ROOM LIST
		</div>
		<div>
			<button on:click={roomCreateModalButton}>+</button>
		</div>
	</div>
	<div class="room-list">		
		{#each $myData.rooms as room}
			<a href="/chat/room?id={room}">
				<div>
					{roomlist.get(room)?.name}
				</div>
				{#if roomlist.get(room)?.roomtype === RoomType.LOCK}
					<div>&#x1F512</div>
				{:else}
					<div></div>
				{/if}
				<div>
					{roomlist.get(room)?.memberCount}
				</div>
			</a>
		{/each}
		{#if $myData.rooms.length > 0}
			<div class="divider">
				
			</div>
		{/if}
		{#each roomlist as room}
			{#if (!$myData.rooms.includes(room[0]))}
				<a href="/chat/room?id={room[0]}">
					<div>
						{room[1].name}
					</div>
					{#if room[1].roomtype === RoomType.LOCK}
						<div>&#x1F512</div>
					{:else}
						<div></div>
					{/if}
					<div>
						{room[1].memberCount}
					</div>
				</a>
			{/if}
		{/each}
	</div>
</div>

<style>
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
		font-size: 25px;
		font-weight: 500;
		background-color: var(--bg-color);
		border: none;
	}

	a {
		text-decoration: none;
	}

	.room-list > a {
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

	.room-list > a > :nth-child(1) {
		
		padding-left: 20px;
	}

	.room-list > a > :nth-child(2) {
		display: flex;
		padding-left: 5px;
	}

	.room-list > a > :nth-child(3) {
		flex-grow: 10;
		text-align: right;
		padding-right: 20px;
	}

	.room-list > a:hover {
		background-color: var(--hover-color);
	}

	.divider {
		width: 770px;
		height: 20px;
	}


</style>
