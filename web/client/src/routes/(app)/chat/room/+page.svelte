<script lang="ts">
    import InviteModal from './InviteModal.svelte';
    import SettingModal from './SettingModal.svelte';
    import RoomoutModal from './RoomoutModal.svelte';
    import { ModalStatesStore, myData } from '../../../../store';

    interface Message {
        sender: string;
        avatarSrc: string;
        body: string;
        isDM: boolean;
        date: string;
    }

    enum Level {
        "host",
        "admin",
        "member"
    }

    interface Profile {
        id: string;
        avatarSrc: string;
        level: Level;
    }

    let messageHistory: Message[] = [
        { sender: "seonhoki", body: "kick the dongchoi man~", isDM: false, avatarSrc: "/asset/hhwang.png", date: "10:00" },
        { sender: "dongchoi", body: "kick the dongchoi man~ kick the dongchoi man, kick the dongchoi man, kick the dongchoi man, kick the dongchoi man", isDM: false, avatarSrc: "/asset/hhwang.png", date: "10:00" },
        { sender: "seonhoki", body: "kick the dongchoi man~", isDM: true, avatarSrc: "/asset/hhwang.png", date: "10:00" },
        { sender: "seonhoki", body: "kick the dongchoi man~", isDM: false, avatarSrc: "/asset/hhwang.png", date: "10:00" },
    ];

    const membersExample = [
        { id: "hhwang", avatarSrc: "/asset/hhwang.png", level: Level.admin },
        { id: "sooyokim", avatarSrc: "/asset/hhwang.png", level: Level.admin },
        { id: "dongchoi", avatarSrc: "/asset/default_profile.png", level: Level.member },
        { id: "seonhoki", avatarSrc: "/asset/hhwang.png", level: Level.host },
    ];

    let members = new Map<string, Profile>();

    for (let i = 0; i < membersExample.length; i++) {
        members.set(membersExample[i].id, membersExample[i]);
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
        <div class="chat-main-box">
            <div class="chatting-box">
                {#each messageHistory as message}
                    <div class={$myData.id === message.sender ? "chatting my-message" : "chatting"}>
                        <div>
                            <img src="{message.avatarSrc}" alt="프로필 이지미" class="chatting-box-avatar">
                        </div>
                        <div>
                            <div>
                                <div>
                                    {message.sender}
                                </div>
                                <div>
                                    10:00
                                </div>
                            </div>
                            <div>
                                {message.body}
                            </div>
                        </div>
                    </div>
                {/each}
                
            </div>
            <div class="chat-send-box">
                <div>
                    <input type="text" placeholder="chat here">
                </div>
                <div class="send-button">
                    &#9655;
                </div>
            </div>
        </div>
        <div class="chatroom-people-list-box">
            <div class="chatroom-people-list">
                <div class="chatroom-my-profile">
                    <div>
                        <img src="{$myData.avatarSrc}" alt="프로필 이미지" class="profile-photo">
                    </div>
                    <div>
                        {$myData.id}
                    </div>
                    {#if members.get($myData.id)?.level == Level.host}
                        <div>&#128081;</div>
                    {:else if members.get($myData.id)?.level == Level.admin}
                        <div>&#128736;</div>
                    {:else if members.get($myData.id)?.level == Level.member}
                        <div></div>
                    {/if}
                </div>

                {#each Array.from(members) as [key, value]}
                    {#if key !== $myData.id}
                        <div class="chatroom-people">
                            <div>
                                <img src="{value.avatarSrc}" alt="프로필 이미지" class="profile-photo">
                            </div>
                            <div>
                                {key}
                            </div>
                            {#if value.level == Level.host}
                                <div>&#128081;</div>
                            {:else if value.level == Level.admin}
                                <div>&#128736;</div>
                            {:else if value.level == Level.member}
                                <div></div>
                            {/if}
                        </div>
                    {/if}
                {/each}
            </div>
            <div class="chat-menu-list">
                <div>
                    MUTE
                </div>
                <div>
                    KICK
                </div>
            </div>

        </div>
    </div>
</div>

<style>
    /* top line ==============*/
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

    /* top line ==============*/

    .chatroom-bottom-box {
        display: flex;
        flex-direction: row;
        height: 400px;
    }
    
    .chat-main-box {        
        width: 540px;
        height: 380px;
        margin-left: 10px;
        margin-right: 10px;
        border: 1px solid var(--border-color);
    }

    
    .chatting {
        display: flex;
        flex-direction: row;
        text-align: left;
        word-break: break-all;
        
        margin: 10px;
    }
    
    .chatting > div:nth-child(2) {
        display: flex;
        flex-direction: column;

    }

    .chatting > div:nth-child(2) > div:nth-child(1) {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .chatting > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
        font-size: 18px;
        font-weight: 400;
        margin-right: 10px;
    }

    .chatting > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) {
        font-size: 12px;
        margin-right: 10px;
    }
    
    .chatting-box-avatar {
        border-radius: 50px;
        width: 40px;
        height: 40px;

        margin-right: 10px;
    }

    .my-message {
        color: var(--point-color);
    }

    .chat-room-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding-right: 20px;
        padding-top: 7px;
    }

    /* chat-send-box */

    .chat-send-box {
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
        align-items: center;
        border: 1px solid var(--border-color);
        height: 30px;
        margin-top: 10px;
        /* margin-bottom: 10px; */
        width: 500px;
        margin-left: 20px;
    }

    .chat-send-box > div > input {
        width: 430px;
        height: 27px;
        background-color: var(--bg-color);
        border: none;

        color: var(--font-color);  
    }

    .send-button {
        width: 40px;
        background-color: var(--bg-color);
        color: var(--text-color);        
        text-align: center;
    }

    /* chat-send-box */

    

    /*  chatroom-people-list-box  */
    .chatroom-people-list-box {
        width: 220px;
        height: 380px;
        margin-left: 10px;
        margin-right: 10px;
        border: 1px solid var(--border-color);
    }

    
    .chatroom-people-list {
        height : 330px;        
    }

    .chatroom-people-list > div {
        width: 195px;
        margin-left: 10px;
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border-color);
    }

    .chatroom-my-profile {
        margin-bottom: 20px;
    }

    .chatroom-people-list > div:hover {
        background-color: var(--hover-color);
    }

    .profile-photo {
        border-radius: 15px;
        max-width: 30px;        
    }

    .chatroom-people-list > div > :nth-child(1) {
        margin : 2px 2px 2px 2px;
        flex-grow: 1;
    }
    
    .chatroom-people-list > div > :nth-child(3) {
        flex-grow: 10;
        text-align: right;
        margin-right: 5px;
    }

    /*  chatroom-people-list-box  */
    
    /* chat-menu-list */
    .chat-menu-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

    }

    .chat-menu-list > div {
       border: 1px solid var(--border-color);
       width: 92.5px;
       height: 30px;
       display: flex;
       justify-content: center; 
       align-items: center;       
    }

    .chat-menu-list > div:hover {
        background-color: var(--hover-color);
    }

    .chat-menu-list > :nth-child(1) {
        margin-left: 10px;
    }

    .chat-menu-list > :nth-child(2) {
        margin-right: 10px;
    }

    /* chat-menu-list */

    /* 스크롤바 설정 */ 
   
    .chatting-box {
        height: 325px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .chatting-box::-webkit-scrollbar {
        width: 6px;
        height: 30px;
    }

    .chatting-box::-webkit-scrollbar-track {
        background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
    }

    .chatting-box::-webkit-scrollbar-thumb {
        background-color: #D9D9D9; /* 스크롤바 썸바 배경색 설정 */
        border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
    }

    .chatting-box::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* 스크롤바 썸바 호버 배경색 설정 */
    }
    /* 스크롤바 설정 */ 
</style>
