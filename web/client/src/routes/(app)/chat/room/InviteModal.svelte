<script lang="ts">
    export let isInviteModal = false;
    export let closeInviteModal = () => {

    };
</script>

    <div class="modal-container" style="{isInviteModal ? 'display: block;' : 'display: none;'}">
    <div class="modal-title">
        <div>
        INVITE FRIEND
        </div>
        <div class="close-button">
            <button on:click={closeInviteModal}>&#215;</button>
        </div>
    </div>
    <div class="modal-content">
        <div class="find-friend">
            <div class="find-friend-input">
                <input type="text" placeholder="FIND FRIEND">
            </div>
            <div class="find-button">
                <button>&#128269;</button>
            </div>
        </div>
        <div class="bottom-line">
            <div>
                unavailable
            </div>        
            <div>
                INVITE
            </div>
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

    .bottom-line > :nth-child(2) {
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
    }
  
</style>
  