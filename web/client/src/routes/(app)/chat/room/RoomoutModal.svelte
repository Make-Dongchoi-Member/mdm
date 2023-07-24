<script lang="ts">
    import { goto } from "$app/navigation";
    import { modalStatesStore, myData, openedRoom } from "../../../../store";

    const outButtonEvent = () => {
        /*
            @TODO
            방에서 나가는 API 요청
        */
        
        deleteRoomId($openedRoom.id);
        goto("/chat");
        $modalStatesStore.isRoomoutModal = false;
    }

    function deleteRoomId(deleteID: string) {
        $myData.rooms = $myData.rooms.filter((room) => room.id !== deleteID);
    }

</script>

    <div class="modal-container {$modalStatesStore.isRoomoutModal ? 'flex-container' : 'hidden-container'}">
        <div class="modal-title">
            ARE YOU SURE?
        </div>
        <div class="modal-content">
            <div>
                <button on:click={outButtonEvent} class="yes-button">YES</button>
            </div>
            <div>
                <button on:click={() => { $modalStatesStore.isRoomoutModal = false; }} class="no-button">NO</button>
            </div>
        </div>
    </div>
  
<style>
    .modal-container {
        width: 690px;
        height: 150px;
        
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        
        position: absolute;
        top: 40%;
        left: 50%;
        margin-left: -340px;
    }

    .flex-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .hidden-container {
        display: none;
    }



    .modal-title {
        text-align: center;
    }

    .modal-content {
        display: flex;
        flex-direction: row;
        justify-content: center;

        margin-bottom: 10px;
        
    }

    

    .yes-button {
        width: 100px;
        height: 35px;
        
        text-align: center;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        margin-right: 5px;
    }

    .yes-button:hover {
        background-color: var(--hover-color);
    }

    .no-button {
        width: 100px;
        height: 35px;
        
        text-align: center;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        margin-left: 5px;
    }

    .no-button:hover {
        background-color: var(--hover-color);
    }

  
</style>
  