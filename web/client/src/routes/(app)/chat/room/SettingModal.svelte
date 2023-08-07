<script lang="ts">
    import { onMount } from 'svelte'
    import { modalStatesStore, myData, openedRoom } from '../../../../store';
    import { RoomType } from '../../../../enums';
    import type { RoomInfoDTO } from '../../../../interfaces';
    
    
    let isPrivate: boolean = $openedRoom.roomtype === RoomType.PRIVATE;
    let isPassword: boolean = $openedRoom.roomtype === RoomType.LOCK;  
    let isPasswordChanged: boolean = false;
    let isMakeButtonActivation: boolean = false;
    let roomNameInputValue: string = $openedRoom.name;
    const initialRoomInfo: RoomInfoDTO = { 
        roomId: $openedRoom.id,
        hostId: $myData.id,
        roomname: $openedRoom.name,
        password:"initialpw",
        roomtype: $openedRoom.roomtype,
    };    
    
    onMount(() => {
        const makeButton = document.querySelector(".make-button") as HTMLButtonElement;        
        makeButton.disabled = !isMakeButtonActivation;                
        /*
            @TODO
            방 설정 정보 API 요청
            방 설정 값 input 채워넣기
        */      
    });

    const closeButtonEvent = () => {        
        const roomnameInputBox = document.querySelector(".roomname-inputbox") as HTMLInputElement;
        const passwordInputBox = document.querySelector(".password-inputbox") as HTMLInputElement;

        $modalStatesStore.isSettingModal = false;
        roomnameInputBox.value = initialRoomInfo.roomname;
        passwordInputBox.value = $openedRoom.roomtype === RoomType.LOCK ? initialRoomInfo.password : "";
        isMakeButtonActivation = false;
        isPrivate = $openedRoom.roomtype === RoomType.PRIVATE ? true : false;
        isPassword = $openedRoom.roomtype === RoomType.LOCK ? true : false;
    }

    const changeButtonEvent = () => {
        /*
            @TODO
            방 설정을 위해 필요한 입력 체크
            방 설정 변경 API 요청
        */
        $modalStatesStore.isSettingModal = false;
    }

    const roomnameInputBoxEvent = (e: any) => {
        isMakeButtonActivation = makeButtonActivationEvent();
    }

    const passwordInputBoxEvent = (e: any) => {    
        e.target.value = e.target.value.replace(/\s/g, '');
        isMakeButtonActivation = makeButtonActivationEvent();      
    }

    const passwordInitialEvent = (e: any) => {
        if (e.target.value === "initialpw") {
            e.target.value = "";
        }
        isPasswordChanged = true;
    }

    const privateButtonToggle = () => {
        const passwordInputBox = document.querySelector(".password-inputbox") as HTMLInputElement;

        isPrivate = !isPrivate;
        if (isPrivate) {
            passwordInputBox.value = "";
        }
        isPassword = false;
        isPasswordChanged = false;
        isMakeButtonActivation = makeButtonActivationEvent();            
    }

    const passwordButtonToggle = () => {
        const passwordInputBox = document.querySelector(".password-inputbox") as HTMLInputElement;
        isPassword = !isPassword;
        if (!isPassword) {
            passwordInputBox.value = "";
            isPasswordChanged = false;
        }
        if (initialRoomInfo.roomtype === RoomType.LOCK && isPassword) {
            passwordInputBox.value = initialRoomInfo.password;
        }
        isPrivate = false;         
        isMakeButtonActivation = makeButtonActivationEvent();
    }

    const makeButtonActivationEvent = () => {
        const roomname: string = ((document.querySelector(".roomname-inputbox") as HTMLInputElement).value).trim();
        const password: string = (document.querySelector(".password-inputbox") as HTMLInputElement).value;
        if ((initialRoomInfo.roomtype === RoomType.PRIVATE && !isPrivate)
                || (initialRoomInfo.roomtype !== RoomType.PRIVATE && isPrivate)) {
            return true;
        }
        if ((initialRoomInfo.roomtype === RoomType.LOCK && !isPassword)
                || (initialRoomInfo.roomtype !== RoomType.LOCK && isPassword && password !== "")
                || (password !== "" && isPasswordChanged)
                ) {
            return true;
        }
        if (roomname === "" || roomname === initialRoomInfo.roomname) {
            return false;
        }
        if (isPassword && password === "") {
            return false;
        }
        return true;            
    }


</script>

    <div class="modal-container" style="{$modalStatesStore.isSettingModal ? 'display: block;' : 'display: none;'}">
    <div class="modal-title">
        <div>
            YOUR CHAT ROOM
        </div>
        <div class="close-button">
            <button on:click={closeButtonEvent}>&#215;</button>
        </div>
    </div>
    <div class="modal-content">
        <div class="room-name">
            <div class="room-name-input">
                <input 
                    class="roomname-inputbox"
                    on:input={roomnameInputBoxEvent}
                    bind:value={roomNameInputValue}
                    type="text" 
                    placeholder="ROOM NAME" 
                    maxlength=20
                    >
            </div>
            <div>
                <button 
                    on:click={privateButtonToggle}
                    class={isPrivate ? "private-button able" : "private-button disable"}
                    >
                    PRIVATE
                </button>
            </div>
        </div>
        <div class="room-option">
            <div class="password-option">
                <input 
                    class="password-inputbox"
                    value={$openedRoom.roomtype === RoomType.LOCK ? "initialpw" : "" }
                    disabled={isPrivate || !isPassword ? true : false}
                    on:input={passwordInputBoxEvent}
                    on:click={passwordInitialEvent}                    
                    type="password" 
                    placeholder="PASSWORD IF YOU NEED" 
                    maxlength=10                    
                    >
            </div>
            <div>
                <button 
                    on:click={passwordButtonToggle}
                    class={isPassword ? "password-button able" : "password-button disable"}
                    >
                    PASSWORD
                </button>
            </div>
            <button 
                class={isMakeButtonActivation ? 'make-button able' : 'make-button disable'}
                disabled={isMakeButtonActivation ? false : true}
                on:click={changeButtonEvent}
                >
                CHANGE
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
  