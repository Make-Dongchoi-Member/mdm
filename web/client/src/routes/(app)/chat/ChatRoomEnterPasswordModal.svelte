<script lang="ts">
    import { onMount } from 'svelte';
    import { modalStatesStore } from '../../../store';
    import { goto } from '$app/navigation';
    import { page } from "$app/stores";

    let isPrivate: boolean = false;  
    let isPassword: boolean = false;  
    let isMakeButtonActivation: boolean = false;
    let roomNameInputValue: string = "";

    onMount(() => {     
        const makeButton = document.querySelector(".make-button") as HTMLButtonElement;
        const passwordInputBox = document.querySelector(".password-inputbox") as HTMLInputElement;
        const closeButton = document.querySelector(".close-button > button") as HTMLButtonElement;
        
        makeButton.disabled = !isMakeButtonActivation;        

        closeButton.addEventListener("click", () => {
            passwordInputBox.value = "";
            isMakeButtonActivation = false;
            isPrivate = false;
            isPassword = false;
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
        isMakeButtonActivation = makeButtonActivationEvent();
    }

    const passwordInputBoxEvent = (e: any) => {
        e.target.value = e.target.value.replace(/\s/g, '');
        isMakeButtonActivation = makeButtonActivationEvent();
    }


    const makeButtonActivationEvent = () => {
        const roomname: string = ((document.querySelector(".roomname-inputbox") as HTMLInputElement).value).trim();
        const password: string = (document.querySelector(".password-inputbox") as HTMLInputElement).value;
        if (roomname === "") {
            return false;
        }
        if (isPassword && password === "") {
            return false;
        }
        return true;            
    }

    
    

</script>
  
    <div class="modal-container" style="{$modalStatesStore.isPasswordInputModal ? 'display: block;' : 'display: none;'}">
        <div class="modal-title">
            <div>
            PASSWORD INPUT
            </div>
            <div class="close-button">
                <button on:click={() => { $modalStatesStore.isPasswordInputModal = false; }}>&#215;</button>
            </div>
        </div>
        <div class="modal-content">
                <div class="password-option">
                    <input                         
                        class="password-inputbox"
                        on:input={passwordInputBoxEvent}
                        type="password" 
                        placeholder="PASSWORD IF YOU NEED"
                        maxlength=10
                        >
                </div>
                <div>
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
        align-items: center;

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
        text-align: center;

        width: 100px;
        height: 39px;
        border: 1px solid var(--border-color);
        margin-left: 20px;
    }

    .private-button.able {
        background-color: var(--hover-color);
        border: 1px solid var(--point-color);
    }

    .private-button.disable {
        background-color: var(--bg-color);
        border: 1px solid var(--border-color); 
    }

    .private-button.disable:hover {
        background-color: var(--hover-color);
    }

    .room-option {
        display: flex;
        flex-direction: row;
        align-items: center;         
        margin-left: 20px;
        margin-top: 10px;
    }

    .room-option > :nth-child(1) > input {
        width: 320px;
        height: 35px;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);

        color: var(--font-color);      
    }

    .password-button {
        width: 100px;
        height: 39px;

        text-align: center;        
        border: 1px solid var(--border-color);
        margin-left: 20px;
    }


    .password-button.able {
        background-color: var(--hover-color);
        border: 1px solid var(--point-color);
    }

    .password-button.disable {
        background-color: var(--bg-color);
        border: 1px solid var(--border-color); 
    }

    .password-button.disable:hover {
        background-color: var(--hover-color);
    }

    .make-button {
        width: 100px;
        height: 39px;
        border: 1px solid var(--border-color);        
        
        text-align: center;
        margin-left: 175px;
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
  