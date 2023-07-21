<script lang="ts">
    import { onMount } from 'svelte';
    import { modalStatesStore } from '../../../store';
    import { goto } from '$app/navigation';

    let isPrivate: boolean = false;  
    let isMakeButtonActivation: boolean = false;
    let roomNameInputValue: string = "";

    onMount(() => {
        const privateButton = document.querySelector(".private-button") as HTMLDivElement;       
        const makeButton = document.querySelector(".make-button") as HTMLButtonElement;
        const roomnameInputBox = document.querySelector(".roomname-inputbox") as HTMLInputElement;
        const passwordInputBox = document.querySelector(".password-inputbox") as HTMLInputElement;
        const closeButton = document.querySelector(".close-button > button") as HTMLButtonElement;
        
        makeButton.disabled = !isMakeButtonActivation;
        
        privateButton.addEventListener("click", (e: any) => {
            if (isPrivate) {
                e.target.style.backgroundColor = "var(--bg-color)";
                e.target.style.border = "1px solid var(--border-color)";
            } else {
                e.target.style.backgroundColor = "var(--hover-color)";
                e.target.style.border = "1px solid var(--point-color)";
            }
            isPrivate = !isPrivate;
        });

        privateButton.addEventListener("mouseover", (e: any) => {      
            e.target.style.backgroundColor = "var(--hover-color)";
        });
        
        privateButton.addEventListener("mouseout", (e: any) => {
            if (!isPrivate) {
                e.target.style.backgroundColor = "var(--bg-color)";
            }
        });

        closeButton.addEventListener("click", () => {
            roomnameInputBox.value = "";
            passwordInputBox.value = "";
            isMakeButtonActivation = false;
            privateButton.style.backgroundColor = "var(--bg-color)";
            privateButton.style.border = "1px solid var(--border-color)";
        });
    });

    const makeButtonEvent = () => {
        /*
            @TODO
            방 만들기에 필요한 입력값을 체크.
            새로운 방 만들기 API 요청.
            요청 콜백으로 라우터 이동.
            */
        // const roomID = createRoom();
        const roomID = "room0001";
        goto(`/chat/room?id=${roomID}`);
        $modalStatesStore.isRoomCreateModal = false;
    }

    const roomnameInputBoxEvent = (e: any) => {    
        if (e.target.value !== "") {
            isMakeButtonActivation = true;                
        } else {
            isMakeButtonActivation = false;
        }
    }
    

</script>
  
    <div class="modal-container" style="{$modalStatesStore.isRoomCreateModal ? 'display: block;' : 'display: none;'}">
        <div class="modal-title">
            <div>
            NEW CHAT ROOM
            </div>
            <div class="close-button">
                <button on:click={() => { $modalStatesStore.isRoomCreateModal = false; }}>&#215;</button>
            </div>
        </div>
        <div class="modal-content">
            <div class="room-name">
                <div class="room-name-input">
                    <input 
                        on:input={roomnameInputBoxEvent}
                        bind:value={roomNameInputValue}
                        class="roomname-inputbox" 
                        type="text" 
                        placeholder="ROOM NAME" 
                        maxlength=20
                        >
                </div>
                <div class="private-button">
                    PRIVATE
                </div>
            </div>
            <div class="room-option">
                <div class="password-option">
                    <input 
                        disabled={isPrivate ? true : false}
                        style="visibility: {isPrivate ? 'hidden' : 'visible'};"
                        class="password-inputbox" 
                        type="password" 
                        placeholder="PASSWORD IF YOU NEED"
                        maxlength=10
                        >
                </div>
                {#if isPrivate}
                <div>
                    IT DOESN'T SHOW YOUR ROOM ON LIST
                </div>
                {:else}
                <div></div>
                {/if}                
                <button 
                    class={isMakeButtonActivation ? 'make-button able' : 'make-button disable'}
                    disabled={isMakeButtonActivation ? false : true}
                    on:click={makeButtonEvent} >
                    MAKE
                </button>                
            </div>
        </div>
    </div>
  
<style>
    .modal-container {
        position: absolute;
        top: 100px;
        left: 50%;
        margin-left: -380px;
        width: 775px;
        height: 150px;

        display: flex;

        justify-content: center;
        align-items: center;

        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
    }

    .modal-title {      
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        margin-left: 20px;
        margin-top: 10px;
    }

    .close-button > button {
        font-size: 25px;
        font-weight: 500;
        flex-grow: 0;
        text-align: right;
        background-color: var(--bg-color);
        color: var(--text-color);
        border: none;
        outline: none;

        margin-right: 20px;
    }

    .room-name {
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */

        margin-left: 20px;      
    }

    .room-name-input > input {
        width: 320px;
        height: 35px;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);

        color: var(--font-color);  
    }

    .private-button {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;

        width: 100px;

        border: 1px solid var(--border-color);
        margin-left: 20px;
    }

    /* .private-button:hover {
    background-color: var(--hover-color);
    } */

    .room-option {
        display: flex;
        flex-direction: row;
        margin-left: 20px;
        margin-top: 10px;
    }

    .room-option > :nth-child(1) {
        width: 320px;
        height: 35px;
    }

    .room-option > :nth-child(1) > input {
        width: 320px;
        height: 35px;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);

        color: var(--font-color);      
    }

    .room-option > :nth-child(2) {
        color: #848484;
        font-size: small;
        font-weight: 200;

        margin-left: 20px;
        flex-basis: 250px;
    }

    .make-button {
        width: 100px;
        height: 35px;
        border: 1px solid var(--border-color);        
        
        text-align: center;
        margin-left: 30px;
    }    

    .make-button.able:hover {
        background-color: var(--hover-color);
    }

    .make-button.disable {
        color: var(--border-color);
    }

    .make-button.disable:hover {
        background-color: var(--bg-color);
    }

    

</style>
  