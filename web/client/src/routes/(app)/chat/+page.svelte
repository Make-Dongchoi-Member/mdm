<script lang="ts">
    import ChatRoomCreateModal from './ChatRoomCreateModal.svelte';
    import ChatRoomEnterPasswordModal from './ChatRoomEnterPasswordModal.svelte';
    import { modalStatesStore, myData, roomList } from '../../../store';
    import type { Room, RoomEnterDTO } from '../../../interfaces';
    import { onMount } from 'svelte';
    import { RoomType } from '../../../enums';
    import { goto } from '$app/navigation';    

    // let $roomlist: Map<number, Room> = new Map();
    
    let roomEnterInfo: RoomEnterDTO = {roomId:"", userId:"", password:""};
    let thisRoom: Room;
        /*
            @TODO
            룸 리스트 요청 api 해야함.
        */    
    
    let publicRoomlist: Map<number, Room> = new Map();
	
	
    onMount(() => {

        $modalStatesStore.isRoomCreateModal = false;
        /*
            @TODO
        */
        

        getRoomList();
		
		// publicRoomlist = filterRoomsNotInNumbers($roomList, $myData.rooms); 
 
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
            console.log("getRoomList :", data.rooms);
            
            for (let i = 0; i < data.rooms.length; i++) {
                const element = data.rooms[i];
                $roomList.set(Number(element.roomId), element);         
            }
            $roomList = $roomList;
			console.log("getRoomList Map :", $roomList);
        })
        .catch(error => console.error('Error:', error));
    }

	const postRoomEnter = () => {
		const data = {
			roomId: "",
			password: "",
		}
		const response = fetch(`http://localhost:3000/api/room/enter`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
			body: JSON.stringify(data),
        })
        .catch(error => console.error('Error:', error));
	}

    const roomCreateModalButton = () => {
        $modalStatesStore.isRoomCreateModal = true;
    }

    const passwordInputModalButton = () => {
        $modalStatesStore.isPasswordInputModal = true;
    }    

    const roomEnter = (room: Room) => {
        // if ($myData.rooms.some(item => item === room.id)) {
        //     goto(`/chat/room?id=${room.id}`);
        //     return ;
        // }
        // const password: string = room.roomtype === RoomType.lock ? "password 모달에서 값 받기" : "";
        roomEnterInfo.roomId = room.roomId;
        roomEnterInfo.userId = $myData.id;
        if (room.roomtype === RoomType.LOCK) {            
            passwordInputModalButton();
        } else {
            //     방들어가기 API 요청
            //     roomEnterAPI(roomEnterIno)
            const result: boolean = true;
            goto(`/chat/room?id=${room.roomId}`);
        }

    }

    const myRoomEnter = (roomNum: number) => {
        if ($myData.rooms.includes(roomNum)) {
            goto(`/chat/room?id=${roomNum}`);
            return ;
        }
    }

    function filterRoomsNotInNumbers($roomlist: Map<number, Room>, numbers: number[]): Map<number, Room> {
        return new Map([...$roomlist].filter(([roomNumber, room]) => !numbers.includes(roomNumber)));
    }
</script>


<ChatRoomEnterPasswordModal {roomEnterInfo} {thisRoom}/>

<ChatRoomCreateModal />

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
		{#each $myData.rooms as roomNum}

			<button on:click={()=>(myRoomEnter(roomNum))}>

				<div>
					{$roomList.get(roomNum)?.roomname}
				</div>
				{#if $roomList.get(roomNum)?.roomtype === RoomType.LOCK}
					<div>&#x1F512</div>
				{:else}
					<div></div>
				{/if}
				<div>
					{$roomList.get(roomNum)?.memberCount}
				</div>
			</button>
		{/each}
		{#if $myData.rooms.length > 0}
			<div class="divider">
				
			</div>
		{/if}
		{#each $roomList as room}
			{#if !$myData.rooms.includes(Number(room[1].roomId))}
				<button on:click={()=>(roomEnter(room[1]))}>
					<div>
						{room[1].roomname}
					</div>
					{#if room[1].roomtype === RoomType.LOCK}
						<div>&#x1F512</div>
					{:else}
						<div></div>
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

	.room-list > button > :nth-child(1) {
		
		padding-left: 20px;
	}

	.room-list > button > :nth-child(2) {
		display: flex;
		padding-left: 5px;
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
