<script lang="ts">
	import { modalStatesStore } from "../../store";
	import type { Notification } from "../../interfaces";
	import { clickOutside, escapeKey } from "../../actions";

	let myNoti: Notification[] = [
		{sender: 'dongchoi', body: 'GO TO MATCH'},
		{sender: 'hhwang', body: 'GO TO PRIVATE CHATTING ROOM'},
		{sender: 'seonhoki', body: 'GET RELATIONSHIP'},
		{sender: 'jaewchoi', body: 'GO TO MATCH'},
		{sender: 'sooyokim', body: 'GO TO MATCH'},
		{sender: 'dongchoi', body: 'GO TO MATCH'},
		{sender: 'hhwang', body: 'GO TO PRIVATE CHATTING ROOM'},
		{sender: 'seonhoki', body: 'GET RELATIONSHIP'},
		{sender: 'jaewchoi', body: 'GO TO MATCH'},
		{sender: 'sooyokim', body: 'GO TO MATCH'},
		{sender: 'dongchoi', body: 'GO TO MATCH'},
		{sender: 'hhwang', body: 'GO TO PRIVATE CHATTING ROOM'},
		{sender: 'seonhoki', body: 'GET RELATIONSHIP'},
		{sender: 'jaewchoi', body: 'GO TO MATCH'},
		{sender: 'sooyokim', body: 'GO TO MATCH'},
		{sender: 'dongchoi', body: 'GO TO MATCH'},
		{sender: 'hhwang', body: 'GO TO PRIVATE CHATTING ROOM'},
		{sender: 'seonhoki', body: 'GET RELATIONSHIP'},
		{sender: 'jaewchoi', body: 'GO TO MATCH'},
		{sender: 'sooyokim', body: 'GO TO MATCH'},
	]
</script>

<div class="modal-container {$modalStatesStore.isNotiModal ? 'flex-container' : 'hidden-container'}"
	use:clickOutside on:outclick={() => {$modalStatesStore.isNotiModal = false}}
	use:escapeKey on:esckey={() => {$modalStatesStore.isNotiModal = false}}>
	<div class="modal-box">
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
						<span class="simple-text">with</span>
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
</div>

<style>
	.modal-container {
		width: 880px;

		border: 1px solid transparent;
		box-sizing: border-box;

		position: absolute;
		z-index: 2;

		margin-top: 130px;
	}

	.modal-box {
		width: 480px;
		display: flex;
		flex-direction: column;

		background-color: var(--bg-color);
		border: 1px solid var(--border-color);
		border-radius: 2%;

		box-sizing: border-box;
		
		position: absolute;
		top: 8px;
		margin-left: 400px;
	}

	.hidden-container {
		display: none;
	}
		
	.modal-title {
		color: var(--point-color);
		display:flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-left: 15px;
		margin-bottom: 5px;
	}

	.modal-title > :nth-child(1) {
		margin-top: 5px;
	}
		
	.alarm > button {
		width: 30px;
		background-color: var(--bg-color);
		text-align: center;
		border: none;
		border-radius: 70%;
	}

	.modal-content-box {
		height: 350px;
		overflow-y: scroll;

		margin-right: 5px;
		margin-bottom: 15px;
	}

	.modal-content {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;

		position: relative;
		
		width: 96%;
		height: 40px;

		border: 1px solid var(--border-color);
		margin-left: 2%;
		margin-bottom: 10px;
	}
		
	.modal-content > :nth-child(1) {
		position: absolute;
		font-size: 13px;
		margin-left: 10px;

		left: 10px;
	}
		
	.modal-content > :nth-child(2) {
		display: flex;
		flex-direction: row;
		align-items: end;
		text-align: right;
		font-size: 12px;
	}
		
	.simple-text {
		color: var(--border-color);
		font-size: 10px;
		padding-right: 5px;
		padding-bottom: 2px;
	}

	.button-area {
		display: flex;
		text-align: center;
		margin-left: 10px;
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
