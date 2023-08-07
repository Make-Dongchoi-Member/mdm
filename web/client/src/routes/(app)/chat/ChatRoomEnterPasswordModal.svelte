<script lang="ts">
    import { onMount } from 'svelte';
    import { modalStatesStore } from '../../../store';
    import { goto } from '$app/navigation';
    import { myData } from '../../../store';
    import type { Room, RoomEnterDTO } from '../../../interfaces';

    let isMakeButtonActivation: boolean = false;
    let passwordValue: string = "";

    export let postRoomEnter: Function;
    export let selectedRoomId: string;

    onMount(() => {     
        const makeButton = document.querySelector(".make-button") as HTMLButtonElement;
        const passwordInputBox = document.querySelector(".password-inputbox") as HTMLInputElement;
        const closeButton = document.querySelector(".close-button > button") as HTMLButtonElement;
        
        makeButton.disabled = !isMakeButtonActivation;        

        closeButton.addEventListener("click", () => {
            passwordInputBox.value = "";
            isMakeButtonActivation = false;
        });
    });

    const makeButtonEvent = () => {               
        /*
        @TODO
        방 입장 api실행. 비밀번호 넣어서 실행.
        */
       
        postRoomEnter(selectedRoomId, passwordValue);
    }

    const passwordInputBoxEvent = (e: any) => {
        e.target.value = e.target.value.replace(/\s/g, '');
        passwordValue = e.target.value;            
        isMakeButtonActivation = makeButtonActivationEvent(e.target.value);
    }

    const makeButtonActivationEvent = (password: string) => {
        if (password === "") {
            return false;
        }
        return true;            
    }

</script>

<div class="modal-container" style="{$modalStatesStore.isPasswordInputModal ? 'display: block;' : 'display: none;'}">
    <div class="modal-title">
        <div>
            PASSWORD
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
                placeholder="PASSWORD INPUT"
                maxlength=10
                >
        </div>
        <div>
            <button 
                class={isMakeButtonActivation ? 'make-button able' : 'make-button disable'}
                disabled={isMakeButtonActivation ? false : true}
                on:click={makeButtonEvent} >
                OK
            </button>                
        </div>           
    </div>
</div>
  
<style>
    .modal-container {
        position: absolute;
        top: 150px;
        left: 50%;
        margin-left: -200px;
        width: 400px;
        height: 150px;
        
        /* justify-content: center;
        align-items: center; */

        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
    }

    .modal-title {      
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        margin-left: 20px;
        margin-top: 25px;
        height: 40px;
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

    .modal-content {
        display: flex;
        justify-content: space-between;
        margin-left: 20px;
        align-items: center;

        margin-top: 5px;
        margin-bottom: 25px;
    }

    .password-inputbox {
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        color: var(--font-color);          
        height: 38px;
        width: 220px;
    }

    .make-button {
        width: 80px;
        height: 39px;
        border: 1px solid var(--border-color);        
        
        text-align: center;        
        margin-right: 30px
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
  