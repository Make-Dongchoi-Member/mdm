<script lang="ts">
    import { modalStatesStore } from "../../store";
    import type { Notification } from "../../interfaces";

    let myNoti: Notification[] = [
        {sender: 'dongchoi', body: 'JOIN MATCH'},
        {sender: 'hhwang', body: 'JOIN CHAT'},
        {sender: 'seonhoki', body: 'ADD FRIEND'},
        {sender: 'jaewchoi', body: 'JOIN MATCH'},
        {sender: 'sooyokim', body: 'JOIN MATCH'},
        {sender: 'dongchoi', body: 'JOIN MATCH'},
        {sender: 'hhwang', body: 'JOIN CHAT'},
        {sender: 'seonhoki', body: 'ADD FRIEND'},
        {sender: 'jaewchoi', body: 'JOIN MATCH'},
        {sender: 'sooyokim', body: 'JOIN MATCH'},
        {sender: 'dongchoi', body: 'JOIN MATCH'},
        {sender: 'hhwang', body: 'JOIN CHAT'},
        {sender: 'seonhoki', body: 'ADD FRIEND'},
        {sender: 'jaewchoi', body: 'JOIN MATCH'},
        {sender: 'sooyokim', body: 'JOIN MATCH'},
        {sender: 'dongchoi', body: 'JOIN MATCH'},
        {sender: 'hhwang', body: 'JOIN CHAT'},
        {sender: 'seonhoki', body: 'ADD FRIEND'},
        {sender: 'jaewchoi', body: 'JOIN MATCH'},
        {sender: 'sooyokim', body: 'JOIN MATCH'},
        
    ]
</script>

<div class="modal-container {$modalStatesStore.isNotiModal ? 'flex-container' : 'hidden-container'}">
    <div class="modal-title">
        <div>
            NOTIFICATION
        </div>
        <div class="alarm">
            <button on:click={() => { $modalStatesStore.isNotiModal = false; }}>
                &#x1F4E2;
            </button>
        </div>
    </div>
    <div class="modal-content-box">
        {#each myNoti as item}
            <div class="modal-content">
                <div>
                    {item.body}
                </div>
                <div>
                    <span class="simple-text">from</span>
                    <span>{item.sender}</span>
                </div>
                <div class="button-area">
                    <button class="yes-button">&#x2713;</button>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .modal-container {
        width: 500px;
        display: flex;
        flex-direction: column;

        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        
        position: absolute;
        top: 5px;
        right: 10%;
    }

    .hidden-container {
        display: none;
    }
    
    .modal-title {
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-left: 15px;
        margin-bottom: 5px;
    }
    
    .alarm > button {
        background-color: var(--bg-color);
        padding-right: 10px;
        border: none;
    }

    .modal-content-box {
        height: 400px;
        overflow-y: scroll;

        margin-right: 5px;
        margin-bottom: 15px;
    }

    .modal-content {
        display: flex;
        flex-direction: row;
        align-items: center;

        position: relative;
        
        width: 96%;
        height: 40px;

        border: 1px solid var(--border-color);
        margin-left: 2%;
        margin-bottom: 10px;
    }
    
    .modal-content > :nth-child(1) {
        font-size: 13px;
        margin-left: 10px;
    }
    
    .modal-content > :nth-child(2) {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text-align: right;
        font-size: 13px;
        flex-grow: 1;
    }
    
    .simple-text {
        font-size: 10px;
        padding-right: 5px;
        text-align: right;
    }

    .button-area {
        display: flex;
        text-align: center;
    }

    .yes-button {
        background-color: var(--bg-color);
        color: var(--point-color);
        border: none;

        font-size: 25px;
        font-weight: 400;
    }

    .no-button {
        background-color: var(--bg-color);
        color: var(--text-color);
        border: none;
        margin-right: 10px;
    }

    .modal-content-box::-webkit-scrollbar {
        width: 5px;
    }

    .modal-content-box::-webkit-scrollbar-track {
        background-color: var(--bg-color);
    }

    .modal-content-box::-webkit-scrollbar-thumb {
        background-color: var(--border-color);
        border-radius: 4px;
    }

    .modal-content-box::-webkit-scrollbar-thumb:hover {
        background-color: var(--text-color);
    }
</style>
