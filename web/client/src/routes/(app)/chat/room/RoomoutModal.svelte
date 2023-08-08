<script lang="ts">
	import { goto } from "$app/navigation";
	import { modalStatesStore, myData, openedRoom, socketStore } from "../../../../store";
	import { page } from '$app/stores';
    import { clickOutside, escapeKey } from "../../../../actions";

	const outButtonEvent = () => {
		const data = {
			data: {
				roomId: $page.url.searchParams.get("id") as string,
			}
		}
		const response = fetch(`http://localhost:3000/api/chat/room/out`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
			body: JSON.stringify(data),
        })
		.then((response) => {
			if (response.status === 201) {
				deleteRoomId($page.url.searchParams.get("id") as string);
				goto("/chat");
				$modalStatesStore.isRoomoutModal = false;
				$socketStore.emit("chat/out", { userId: $myData.id, roomId: $page.url.searchParams.get("id") });
			} else {
				console.log(response.status);
			}
		})
        .catch((error) => {
			console.log("Error: ", error);
		});
	}

	function deleteRoomId(deleteID: string) {
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
