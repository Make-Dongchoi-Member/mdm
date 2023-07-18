<script lang="ts">
    import InviteModal from './InviteModal.svelte';
    import SettingModal from './SettingModal.svelte';
    import RoomoutModal from './RoomoutModal.svelte';
    import { ModalStatesStore } from '../../../../store';

    let banPerson = 'administrator';

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
                <div class="chatting">
                    <div>
                        dongchoi
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        don’t kick me from team plz..
                    </div>
                </div>
                <div class="chat-room-info">
                    <div>
                        {banPerson}
                    </div>
                    <div>
                        , kick him
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        jaewchoi
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        yes, master.
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>
                <div class="chatting">
                    <div>
                        seonhoki
                    </div>
                    <div>
                        &nbsp;:&nbsp;
                    </div>
                    <div>
                        testchat..
                    </div>
                </div>

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
                <div class="chatroom-people">
                    <div>
                        <img src="/images/basic2.png" alt="버튼 이미지" class="profile-photo">
                    </div>
                    <div>
                        hhwang
                    </div>
                    <div>
                        &#128081;
                    </div>
                </div>
                <div class="chatting-people">
                    <div>
                        <img src="/images/basic2.png" alt="버튼 이미지" class="profile-photo">
                    </div>
                    <div>
                        dongchoi
                    </div>
                    <div>
                        
                    </div>
                </div>
                <div class="chatting-people">
                    <div>
                        <img src="/images/basic2.png" alt="버튼 이미지" class="profile-photo">
                    </div>
                    <div>
                        seonhoki
                    </div>
                    <div>
                        
                    </div>
                </div>
                <div class="chatting-people">
                    <div>
                        <img src="/images/basic2.png" alt="버튼 이미지" class="profile-photo">
                    </div>
                    <div>
                        jaewchoi
                    </div>
                    <div>
                        
                    </div>
                </div>
                <div class="chatting-people">
                    <div>
                        <img src="/images/basic2.png" alt="버튼 이미지" class="profile-photo">
                    </div>
                    <div>
                        sooyokim
                    </div>
                    <div>
                        
                    </div>
                </div>
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
        padding-left: 20px;
        padding-top: 7px;
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
