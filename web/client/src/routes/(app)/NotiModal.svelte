<script lang="ts">
    import { modalStatesStore } from "../../store";
</script>

    <div class="modal-container {$modalStatesStore.isNotiModal ? 'flex-container' : 'hidden-container'}">
        <div class="modal-title">
            <div>
                NOTIFICATION
            </div>
            <div class="alarm">
                <button on:click={() => { $modalStatesStore.isNotiModal = false; }} class="alarm-button">
                    &#x1F4E2;
                </button>
            </div>
        </div>
        <div class="modal-content-box">
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
            <div class="modal-content">
                <div>
                    JOIN MATCH
                </div>
                <div>
                    by dongchoi
                </div>
                <div>
                    <button class="yes-button">&#x2713;</button>
                </div>
                <div>
                    <button class="no-button">&#x2715;</button>
                </div>
            </div>
        </div>
    </div>
  
<style>
    .modal-container {
        width: 305px;
        /* height: 600px; */
        
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        
        position: absolute;
        top: 0%;
        left: 50%;
        margin-left: 320px;
        margin-top: 5px;
    }

    .flex-container {
    }

    .hidden-container {
        display: none;
    }

    .modal-title {
        display:flex;
        flex-direction: row;
        /* justify-content: space-between; */
        align-items: center;
        /* text-align: center; */
        margin-left: 10px;
        margin-bottom: 5px;
    }

    .modal-title >:first-child {
        width: 265px;
    }

    .alarm-button {
        border: none;        
        color: var(--point-color);
    }


    .modal-content {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        
        width: 275px;
        height: 40px;

        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid var(--border-color);
    }

    /* .modal-content > :nth-child(1), .modal-content > :nth-child(2) {
        font-size: 12px;
    } */

    .modal-content > :nth-child(1) {
        flex-basis: 110px;
        margin-left: 10px;
        
        font-size: 13px;
    }

    .modal-content > :nth-child(2) {
        font-size: 13px;
        flex-grow: 1;
    }
    

    .yes-button {    
        text-align: center;
        background-color: var(--bg-color);
        color: var(--point-color);
        border: none;

        font-size: 25px;
        font-weight: 400;
    }

    .no-button {
        text-align: center;
        background-color: var(--bg-color);
        color: var(--text-color);
        border: none;
        margin-right: 10px;
    }

    /* 스크롤바 설정 */ 
    .modal-content-box {
        height: 400px;
        overflow-y: auto;
        overflow-x: hidden;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;
        margin-bottom: 20px;
    }

    .modal-content-box::-webkit-scrollbar {
        width: 6px;
        height: 30px;
    }

    .modal-content-box::-webkit-scrollbar-track {
        background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
    }

    .modal-content-box::-webkit-scrollbar-thumb {
        background-color: #D9D9D9; /* 스크롤바 썸바 배경색 설정 */
        border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
    }

    .modal-content-box::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* 스크롤바 썸바 호버 배경색 설정 */
    }
    /* 스크롤바 설정 */ 
  
</style>
  