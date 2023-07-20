<script lang="ts">
    import { onMount } from 'svelte'
    import { modalStatesStore } from '../../../../store';

    let isPrivate = false;  

    onMount(() => {
        const privateButton = document.querySelector(".private-button") as HTMLDivElement;
        
        /*
            @TODO
            방 설정 정보 API 요청
            방 설정 값 input 채워넣기
        */
        
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
    });

    const changeButtonEvent = () => {
        /*
            @TODO
            방 설정을 위해 필요한 입력 체크
            방 설정 변경 API 요청
        */
        $modalStatesStore.isSettingModal = false;
    }

</script>

    <div class="modal-container" style="{$modalStatesStore.isSettingModal ? 'display: block;' : 'display: none;'}">
    <div class="modal-title">
        <div>
            YOUR CHAT ROOM
        </div>
        <div class="close-button">
            <button on:click={() => { $modalStatesStore.isSettingModal = false; }}>&#215;</button>
        </div>
    </div>
    <div class="modal-content">
        <div class="room-name">
            <div class="room-name-input">
                <input type="text" placeholder="ROOM NAME">
            </div>
            <div class="private-button">
                PRIVATE
            </div>
        </div>
        <div class="room-option">
            <div class="password-option">
                <input type="password" placeholder="PASSWORD IF YOU NEED">
            </div>
            {#if isPrivate}
                <div>
                    IT DOESN'T SHOW YOUR ROOM ON LIST
                </div>
            {:else}
                <div></div>
            {/if}
            <button on:click={changeButtonEvent}>
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
    
    .room-option {
    display: flex;
    flex-direction: row;
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

    .room-option > :nth-child(2) {
    color: #848484;
    font-size: small;
    font-weight: 200;

    margin-left: 20px;
    flex-basis: 250px;
    }

    .room-option > :nth-child(3) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    width: 100px;
    border: 1px solid var(--border-color);

    margin-left: 30px;
    }

    .room-option > :nth-child(3):hover {
    background-color: var(--hover-color);
    }
  
</style>
  