<script lang="ts">
    import Modal from './ChatRoomCreateModal.svelte';
    import { modalStatesStore, myData } from '../../../store';
    import { onMount } from 'svelte';
    import { RoomType } from '../../../enums';
    import type { Room } from '../../../interfaces';

    const roomlist: Room[] = [
            {id: "123", name: 'room1(not enter)', roomtype: RoomType.lock, memberCount: 4},
            {id: "456", name: 'room2(not enter)', roomtype: RoomType.normal, memberCount: 3},
            {id: "7777", name: 'room3(not enter)', roomtype: RoomType.normal, memberCount: 121},
            {id: "5454", name: 'room4(not enter)', roomtype: RoomType.normal, memberCount: 555},
            {id: "3212", name: 'room5(not enter)', roomtype: RoomType.normal, memberCount: 77},
            {id: "9797", name: 'room6(not enter)', roomtype: RoomType.lock, memberCount: 787}
        ]
    
    onMount(() => {
    
        
        /*
            @TODO
        */

    });


    const roomCreateModalButton = () => {
        $modalStatesStore.isRoomCreateModal = true;
    }
 

</script>

<Modal />

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
            <a href="/chat/room?id={room.id}">
                <div>
                    {room.name}
                </div>
                {#if room.roomtype === RoomType.lock}
                    <div>&#x1F512</div>
                {:else}
                    <div></div>
                {/if}
                <div>
                    {room.memberCount}
                </div>
            </a>
        {/each}
        {#each roomlist as room}
            {#if (!$myData.rooms.includes(room))}                            
                <a href="/chat/room?id={room.id}">
                    <div>
                        {room.name}
                    </div>
                    {#if room.roomtype === RoomType.lock}
                        <div>&#x1F512</div>
                    {:else}
                        <div></div>
                    {/if}
                    <div>
                        {room.memberCount}
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

    .room-list > a {
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

    .room-list > a > :nth-child(1) {
        
        padding-left: 10px;        
    }

    .room-list > a > :nth-child(2) {
        display: flex;
        padding-left: 5px;        
    }

    .room-list > a > :nth-child(3) {
        flex-grow: 10;
        text-align: right;
        padding-right: 10px;
    }

    .room-list > a:hover {
        background-color: var(--hover-color);
    }

</style>
