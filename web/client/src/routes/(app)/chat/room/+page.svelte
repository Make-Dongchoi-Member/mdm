<script lang="ts">
    import InviteModal from './InviteModal.svelte';
    import SettingModal from './SettingModal.svelte';
    import RoomoutModal from './RoomoutModal.svelte';
    import { ModalStatesStore, myData } from '../../../../store';
    import ChatMessage from './ChatMessage.svelte';
    import ChatMember from './ChatMember.svelte';

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
                CHAT ROOM NAME
            </div>
            <div class="chat-setting-button">
                <button on:click={() => { $ModalStatesStore.isSettingModal = true; }}>&#9881;</button>
            </div>
            <div class="invite-button">
               <button on:click={() => { $ModalStatesStore.isInviteModal = true; }}>+</button>
            </div>
        </div>            
        <div class="out-of-room-button">
            <button on:click={() => { $ModalStatesStore.isRoomoutModal = true; }}>&#128682;</button>
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
        margin-top: 80px;
        margin-bottom: 20px;
        align-items: center;
    }

    .chatroom-left-top-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width:530px;
        margin-left: 10px;
    }

    .chat-room-name {
        flex-grow: 1;
    }

    .chat-setting-button {
        flex-grow: 1;
        font-size: 25px;
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
        height: 400px;
    }
    
    .chat-room-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding-right: 20px;
        padding-top: 7px;
    }
</style>
