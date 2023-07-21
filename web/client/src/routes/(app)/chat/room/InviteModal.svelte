<script lang="ts">
    import { modalStatesStore } from "../../../../store";

    let isInviteButtonActivated: boolean = false;
    let inputValue: string = "";

    const inviteButtonEvent = () => {
        /*
            @TODO
            유저 초대 API 요청
        */
        inputValue = "";        
        $modalStatesStore.isInviteModal = false;
    }

    /*
        @TODO
        유저 검색 입력이 들어올때마다 유저가 존재하는지 API 요청으로 확인하고
        있으면 unavailable을 available로 변경.
        초대 가능한 상태일때만 초대 버튼 활성화.
    */

    const inputEvent = (e: any) => {
        if (e.target.value !== "") {
            isInviteButtonActivated = true;
        } else {
            isInviteButtonActivated = false;
        }
    }

</script>

    <div class="modal-container" style="{$modalStatesStore.isInviteModal ? 'display: block;' : 'display: none;'}">
        <div class="modal-title">
            <div>
                INVITE FRIEND
            </div>
            <div class="close-button">
                <button on:click={() => { $modalStatesStore.isInviteModal = false; }}>&#215;</button>
            </div>
        </div>
        <div class="modal-content">
            <div class="find-friend">
                <div class="find-friend-input">
                    <input type="text" placeholder="FIND FRIEND" bind:value={inputValue} on:input={inputEvent} maxlength=10>
                </div>
            </div>
            <div class="bottom-line">
                <div>
                    unavailable
                </div>        
                <button 
                    class={isInviteButtonActivated ? 'make-button able' : 'make-button disable'}
                    on:click={inviteButtonEvent} 
                    disabled={isInviteButtonActivated ? false : true}
                    >
                    INVITE
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
        width: 537px;
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

        margin-right: 15px;        
    }

    .find-friend {
        width: 310px;
        /* height: 35px; */
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
        border: 1px solid var(--border-color);

        margin-left: 20px;      
    }

    .find-friend-input > input {
        width: 260px;
        height: 35px;
        background-color: var(--bg-color);
        border: none;
        outline: none;
        /* border: 1px solid var(--border-color); */

        color: var(--font-color);  
        margin-left: 10px;
    }

    .find-button {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }

    .find-button > button {
        font-size: 20px;
        background-color: var(--bg-color);        
        border: none;
        outline: none;
    }    

    .bottom-line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-left: 20px;
        margin-top: 10px;
    }

    .bottom-line > :nth-child(1){
        display: flex;
        flex-direction: column;
        justify-content: center;

        width: 320px;
        height: 35px;
        background-color: var(--bg-color);        
        color: var(--border-color);      
    }

    /* .bottom-line > :nth-child(2) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;

        width: 100px;
        border: 1px solid var(--border-color);

        margin-right: 20px;
    }

    .bottom-line > :nth-child(2):hover {
        background-color: var(--hover-color);
    } */

    .make-button {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;

        width: 100px;
        border: 1px solid var(--border-color);

        margin-right: 20px;
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
  