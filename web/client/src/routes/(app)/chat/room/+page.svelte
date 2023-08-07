<script lang="ts">
    import InviteModal from './InviteModal.svelte';
    import SettingModal from './SettingModal.svelte';
    import RoomoutModal from './RoomoutModal.svelte';
    import { modalStatesStore, socketStore, myData, openedRoom, roomList, myLevel } from '../../../../store';
    import ChatMessage from './ChatMessage.svelte';
    import ChatMember from './ChatMember.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { page } from '$app/stores';
    import { Level } from '../../../../enums';
    import type { Profile, SetRequestDTO, Room } from '../../../../interfaces';
    import { goto } from '$app/navigation';

    const roomName: string = $openedRoom.roomname;
    onMount(() => {
        /*
            @TODO
            URI에서 id 추출해서 방 정보 API 요청하고
            받은 데이터를 store에 있는 openedRoom에 저장
        */
       
        getRoomData();
        myDataUpdate(Number($page.url.searchParams.get("id")) as number);
		console.log("mydata.rooms : ", $myData.rooms);
        $socketStore.emit("chat/join", { userId: $myData.id, roomId: $page.url.searchParams.get("id") })

        $socketStore.on("chat/join", (data: any) => {
            /**
             * @TODO
             * 방에 참가한 사용자를 사용자 목록에 추가하기
            */
            console.log("join:", data);
        });

        $socketStore.on("chat/leave", (data: any) => {
			console.log("chat/leave", data);

			$openedRoom.members.delete(data.userId);
			$openedRoom = $openedRoom;
		});

		$socketStore.on("chat/set-kick", (data: any) => {
			if ($myData.id === data.targetId) {
				console.log("chat/set-kick", data);
				goto("/chat");
			}
		});

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
			console.log("data : ", data);
			data.openedRoom.members = new Map(Object.entries(JSON.parse(data.openedRoom.members)));			
			$openedRoom = data.openedRoom;
			$myLevel = data.openedRoom.members.get(`${$myData.id}`).level as Level;
		})
		.catch(error => console.error('Error:', error));
	}

	onDestroy(() => {
		$socketStore.emit("chat/leave", { userId: $myData.id, roomId: $page.url.searchParams.get("id") })
	})

    const myDataUpdate = (roomId: number) => {
        if (($myData.rooms).includes(roomId)) return;
        $myData.rooms = [...$myData.rooms, roomId];
        console.log("$myData.rooms", $myData.rooms);
    }

</script>

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
                {roomName}
            </div>
            {#if $openedRoom.members.get($myData.id)?.level === Level.HOST}
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
		width:530px;
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
