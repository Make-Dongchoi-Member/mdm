<script lang="ts">
	import { modalStatesStore, profileModalStore, myData } from "../../../store";
	import { clickOutside, escapeKey } from '../../../actions';	
	
	let isInviteButtonActivated: boolean = false;
	let inputValue: string = "";

	const findButtonEvent = () => {
		$profileModalStore.nickname = inputValue;		
		inputValue = "";
		$modalStatesStore.isProfileModal = true;
		$modalStatesStore.isFindModal = false;
	}

	const inputEvent = async (e: any) => {
		const isInviteAvalable = document.querySelector(".invite-check") as HTMLDivElement;
		e.target.value = e.target.value.replace(/\s/g, '');
		inputValue = e.target.value; 

		const isUser = await isUserExistAPI(inputValue);
		if (inputValue !== "" && isUser) {
			isInviteButtonActivated = true;
			isInviteAvalable.textContent = "available";
		} else {
			isInviteButtonActivated = false;
			isInviteAvalable.textContent = "unavailable";
		}
	}	

	const isUserExistAPI = async (nickname: any): Promise<boolean> => {		
		const isAlreayRoom: boolean = $myData.friends.some(friend => friend.nickname === nickname);		
		if (nickname === "" || nickname === $myData.nickname || isAlreayRoom) {
				return false;
		}	
		try {
			const response = await fetch(`http://localhost:3000/api/user/info?nickname=${encodeURIComponent(nickname)}`, {
				method: "GET",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.status === 200) {
				return true;  
			} else if (response.status === 404 || response.status === 400) {
				return false; 
			} else {
				return false;
			}            
		} catch (error) {
			console.error("실패:", error);
		}
		return false;
	}


	const initialInput = () => {
		const isInviteAvalable = document.querySelector(".invite-check") as HTMLDivElement;
		inputValue = "";
		isInviteAvalable.textContent = "unavailable";
		isInviteButtonActivated = false;
	}

</script>

	<div class="find-modal-container" style="{$modalStatesStore.isFindModal ? 'display: block;' : 'display: none;'}"
		use:clickOutside on:outclick={() => {initialInput(); $modalStatesStore.isFindModal = false;}}
		use:escapeKey on:esckey={() => {initialInput(); $modalStatesStore.isFindModal = false;}}>
		<div class="modal-title">
			<div>				
					FIND FRIEND
			</div>
			<div class="close-button">
				<button on:click={() => { $modalStatesStore.isFindModal = false; initialInput();}}>&#215;</button>
			</div>
		</div>
		<div class="modal-content">
			<div class="find-friend">
				<div class="find-friend-input">
					<input type="text" placeholder="INPUT FRIEND NICKNAME" bind:value={inputValue} on:input={inputEvent} maxlength=10>
				</div>
			</div>
			<div class="bottom-line">
				<div class={isInviteButtonActivated ? "invite-check available" : "invite-check"}>
					unavailable
				</div>        
				<button 
					class={isInviteButtonActivated ? 'make-button able' : 'make-button disable'}
					on:click={findButtonEvent} 
					disabled={isInviteButtonActivated ? false : true}
					>
					FIND
				</button>
			</div>
		</div>
	</div>

<style>
	.find-modal-container {
		position: absolute;
		top: 180px;
		left: 50%;
		margin-left: -240px;
		width: 537px;
		height: 150px;

		display: flex;

		justify-content: center;
		align-items: center;

		background-color: var(--dark-color);
		border: 1px solid var(--point-color);
		border-radius: 0.5rem;
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
		background-color: var(--dark-color);
		color: var(--text-color);
		border: none;
		outline: none;

		margin-right: 15px;        
	}

	.find-friend {
		width: 310px;
		display: flex;
		flex-direction: row;
		border: 1px solid var(--border-color);
		margin-left: 20px;      
	}

	.find-friend-input > input {
		width: 260px;
		height: 35px;
		background-color: var(--dark-color);
		border: none;
		outline: none;
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
		background-color: var(--dark-color);        
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

	.invite-check {
		display: flex;
		flex-direction: column;
		justify-content: center;

		width: 320px;
		height: 35px;
		background-color: var(--dark-color);        
		color: var(--border-color);
	}

	.invite-check.available {
		color:rgb(0, 255, 0);
	}

	.make-button {
		text-align: center;
		width: 100px;
		border: 1px solid var(--border-color);
		margin-right: 20px;
		background-color: var(--dark-color);
	}    

	.make-button.able:hover {
		background-color: var(--hover-color);
	}

	.make-button.disable {
		color: var(--border-color);
	}

	.make-button.disable:hover {
		background-color: var(--dark-color);
	}
  
</style>
  