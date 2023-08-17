<script lang="ts">
	import InviteModal from './InviteModal.svelte';
	import SettingModal from './SettingModal.svelte';
	import RoomoutModal from './RoomoutModal.svelte';
	import { modalStatesStore, socketStore, myData, openedRoom } from '../../../../store';
	import ChatMessage from './ChatMessage.svelte';
	import ChatMember from './ChatMember.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Level } from '../../../../enums';
	import { goto } from '$app/navigation';
	import type { Message, Profile, SetRequestDTO } from '../../../../interfaces';
	import ProfileModal from "../../(profileModal)/ProfileModal.svelte";
	

	onMount(() => {
		getRoomData();
		myDataUpdate(Number($page.url.searchParams.get("id")) as number);
		$socketStore.emit("chat/join", { userId: $myData.id, roomId: $page.url.searchParams.get("id") });

		$socketStore.on("chat/enter", (data: any) => {
			console.log(data);
			
			getRoomData();
		});

		$socketStore.on("chat/out", (data: any) => {
			getRoomData();
		});

		$socketStore.on("chat/set-kick", (data: any) => {
			if ($myData.id === data.targetId) {
				$myData.rooms = ($myData.rooms).filter((room) => String(room) !== $page.url.searchParams.get("id"));
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

	const getRoomData = async () => {
		const response = await fetch(`http://localhost:3000/api/chat/room?room_id=${$page.url.searchParams.get("id")}`, {
			method: "GET",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(response => response.json())
		.then(data => {
			$openedRoom.hostId = data.openedRoom.hostId;
			$openedRoom.roomId = data.openedRoom.roomId;
			$openedRoom.roomname = data.openedRoom.roomname;
			$openedRoom.roomtype = data.openedRoom.roomtype;
			$openedRoom.history = data.openedRoom.history.map((m: any): Message => {
				m.date = new Date(m.date);
				return m;
			});
			$openedRoom.memberCount = data.openedRoom.memberCount;
			$openedRoom.members = new Map(Object.entries(JSON.parse(data.openedRoom.members)));
			$openedRoom.banList = data.openedRoom.banList;
			$openedRoom.myLevel = ($openedRoom.members.get(`${$myData.id}`) as Profile).level;
			$openedRoom = $openedRoom;
			console.log('openRoom', $openedRoom);
		})
		.catch(error => console.error('Error:', error));
	}

	onDestroy(() => {
		$socketStore.emit("chat/leave", { userId: $myData.id, roomId: $page.url.searchParams.get("id") })
	})

	const myDataUpdate = (roomId: number) => {
			if (($myData.rooms).includes(roomId)) return;
			$myData.rooms = [...$myData.rooms, roomId];
	}

</script>

{#if $modalStatesStore.isProfileModal}
<ProfileModal />
{/if}
<InviteModal />
<SettingModal />
<RoomoutModal />

<div class="chat-box">
    <div class="chatroom-top-box">
        <div class="chatroom-left-top-box">
            <div class="back-button" >
                <a href="/chat">&#11013;</a>
            </div>
            <div class="chat-room-name">
                {$openedRoom.roomname}
            </div>
            {#if $openedRoom.myLevel === Level.HOST}
                <div class="chat-setting-button">
                    <button on:click={() => { $modalStatesStore.isSettingModal = true; }}>&#9881;</button>
                </div>
            {:else}
                <div class="chat-setting-button"></div>
            {/if}
            <div class="invite-button">
               <button on:click={() => { $modalStatesStore.isInviteModal = true; }}>+</button>
            </div>
        </div>
        <div class="out-of-room-button">
            <button on:click={() => { $modalStatesStore.isRoomoutModal = true; }}>&#128682;</button>
        </div>
    </div>
    <div class="chatroom-bottom-box">
        <ChatMessage />
        <ChatMember />
    </div>
</div>

<style>
	.chatroom-top-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		height: 80px;
	}

	.chatroom-left-top-box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 560px;
		/* margin-left: 10px; */
	}

	.chat-room-name {
		flex-grow: 1;
		text-align: left;
		margin-left: 10px;
	}

	.chat-setting-button {
		height: 30px;
		flex-grow: 1;
		flex-basis: 40px;
		font-size: 25px;
		padding-bottom: 4px;
	}

	.chat-setting-button > button {
		font-size: 25px;

		background-color: var(--bg-color);
		color: var(--text-color);
		border: none;
		outline: none;
	}

	.back-button {
		font-size: 20px;
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
		padding-bottom: 4px;
	}

	.invite-button > button {
		font-size: 25px;
		font-weight: 500;

		background-color: var(--bg-color);
		color: var(--text-color);
		border: none;
		outline: none;
	}

	.out-of-room-button {
		margin-right: 10px;
	}

	.out-of-room-button > button {
		font-size: 20px;

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
		
	.chat-room-info {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		padding-right: 20px;
		padding-top: 7px;
	}
</style>
