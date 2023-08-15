<script lang="ts">
	import { goto } from "$app/navigation";
	import { modalStatesStore, myData, openedRoom, socketStore } from "../../../../store";
	import { page } from '$app/stores';
    import { clickOutside, escapeKey } from "../../../../actions";

	const outButtonEvent = async () => {
		roomOut($page.url.searchParams.get("id") as string);
	}
	
	const roomOut = async (roomId: string) => {
		try {
			const response = await fetch("http://localhost:3000/api/chat/room/out", {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data: { roomId } }),
			})
			.then(() => {
				deleteRoomId($page.url.searchParams.get("id") as string);
				$modalStatesStore.isRoomoutModal = false;
				$socketStore.emit("chat/out", { userId: $myData.id, roomId });
				goto("/chat");
			});
			
		} catch (error) {
			console.error("실패:", error);
		}
	}

	const deleteRoomId = (deleteID: string) => {
		$myData.rooms = ($myData.rooms).filter((room) => String(room) !== deleteID);
		$myData = $myData;
	}
</script>

<div class="modal-container {$modalStatesStore.isRoomoutModal ? '' : 'hidden-container'}"
	use:clickOutside on:outclick={() => {$modalStatesStore.isRoomoutModal = false}}
	use:escapeKey on:esckey={() => {$modalStatesStore.isRoomoutModal = false}}>
	<div class="modal-title">
		ARE YOU SURE?
	</div>
	<div class="modal-content">
		<button on:click={outButtonEvent} class="yes-button">YES</button>
		<button on:click={() => { $modalStatesStore.isRoomoutModal = false; }} class="no-button">NO</button>
	</div>
</div>

<style>
	.modal-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

		width: 690px;
		height: 150px;
		
		background-color: var(--dark-color);
		border: 1px solid var(--point-color);
		border-radius: 0.5rem;
		
		position: absolute;
		top: 30%;
		left: 25%;
	}

	.hidden-container {
		display: none;
	}

	.modal-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		width: 280px;
	}

	button {
		width: 120px;
		height: 35px;
		background-color: var(--dark-color);
	}

	button:hover {
		background-color: var(--hover-color);
	}
</style>
