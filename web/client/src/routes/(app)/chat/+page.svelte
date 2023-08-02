<script lang="ts">
    import ChatRoomCreateModal from './ChatRoomCreateModal.svelte';
    import ChatRoomEnterPasswordModal from './ChatRoomEnterPasswordModal.svelte';
    import { modalStatesStore, myData, roomList } from '../../../store';
    import type { Room, RoomEnterDTO } from '../../../interfaces';
    import { onMount } from 'svelte';
    import { RoomType } from '../../../enums';
    import { goto } from '$app/navigation';    
    import type { Room } from '../../../interfaces';

    let roomlist: Map<number, Room> = new Map();

    
    let roomEnterInfo: RoomEnterDTO = {roomId:"", userId:"", password:""};
    let thisRoom: Room;
        /*
            @TODO
            룸 리스트 요청 api 해야함.
        */    
    const publicRoomlist = $roomList.filter(item1 => !($myData.rooms).some(item2 => item2.id === item1.id));    
    onMount(() => {

        console.log("$myData.rooms", $myData.rooms);
        console.log("publicRoomList", publicRoomlist);
        /*
            @TODO
        */
        

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

    const passwordInputModalButton = () => {
        $modalStatesStore.isPasswordInputModal = true;
    }    

    const roomEnter = (room: any) => {
        if ($myData.rooms.some(item => item.id === room.id)) {
            goto(`/chat/room?id=${room.id}`);
            return ;
        }
        // const password: string = room.roomtype === RoomType.lock ? "password 모달에서 값 받기" : "";
        roomEnterInfo.roomId = room.id;
        roomEnterInfo.userId = $myData.id;
        if (room.roomtype === RoomType.lock) {            
            passwordInputModalButton();
        } else {
            //     방들어가기 API 요청
            //     roomEnterAPI(roomEnterIno)
            const result: boolean = true;
            goto(`/chat/room?id=${room.id}`);
        }

    }




    
 

</script>


<ChatRoomCreateModal />
<ChatRoomEnterPasswordModal {roomEnterInfo} {thisRoom}/>

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

            <button on:click={()=>(roomEnter(room))}>

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
            </button>
        {/each}
        {#if $myData.rooms.length > 0 && publicRoomlist.length > 0}
            <div class="divider">
                
            </div>
        {/if}
        {#each publicRoomlist as room}
                <button on:click={()=>(roomEnter(room))}>

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
                </button>
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
        width: 770px;
        height: 380px;
        overflow-y: auto;
        overflow-x: hidden;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;

        margin-bottom: 20px;
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
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        
        width: 760px;
        margin-top : 80px;
        margin-bottom: 20px;
    }
    
    .chat-title > :nth-child(1) {        
        flex-grow: 10;
        text-align: center;
    }

    .chat-title > :nth-child(2) > button {
        font-size: 25px;
        font-weight: 500;
        flex-grow: 0;
        text-align: right;
        background-color: var(--bg-color);
        color: var(--text-color);
        border: none;
        outline: none;
    }

    a {
        text-decoration: none;
    }

    .room-list > button {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        height: 40px;
        width: 370px;
        margin-right: 10px;
        margin-bottom: 10px;
        outline: none;
        border: 1px solid var(--border-color);
        background-color: var(--bg-color);
        color: var(--text-color);         
    }

    .room-list > button > :nth-child(1) {
        
        padding-left: 10px;        
    }

    .room-list > button > :nth-child(2) {
        display: flex;
        padding-left: 5px;        
    }

    .room-list > button > :nth-child(3) {
        flex-grow: 10;
        text-align: right;
        padding-right: 10px;
    }

    .room-list > button:hover {
        background-color: var(--hover-color);
    }

    .divider {
        width: 770px;
        height: 20px;
    }


</style>
