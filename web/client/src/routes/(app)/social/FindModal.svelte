<script lang="ts">
	import { modalStatesStore, profileModalStore, myData, apiUrl } from "../../../store";
	import { clickOutside, escapeKey } from '../../../actions';	
	import type { UserData } from "../../../interfaces";
  import { onMount } from "svelte";
	
	let isInviteButtonActivated: boolean = false;
	let inputValue: string = "";
	let receiver: UserData;

	onMount(() => {
		const inputTag = document.querySelector("#find-input") as HTMLInputElement;
		inputTag.focus();
	});

	const findButtonEvent = () => {
		$profileModalStore.nickname = inputValue;		
		inputValue = "";
		$modalStatesStore.isProfileModal = true;
		$modalStatesStore.isFindModal = false;
	}

	const inputEvent = async (e: any) => {		
		e.target.value = e.target.value.replace(/\s/g, '');
		inputValue = e.target.value; 

		const isUser = await isUserExistAPI(inputValue);
		if (inputValue !== "" && isUser) {
			isInviteButtonActivated = true;
		} else {
			isInviteButtonActivated = false;
		}
	}	

	const isUserExistAPI = async (nickname: string): Promise<boolean> => {		
		const isAlreayFriend: boolean = $myData.friends.some(friend => friend.nickname === nickname);

		if (nickname === "" 
				|| nickname === $myData.nickname 
				|| isAlreayFriend 
				|| nickname.length < 3) {
			return false;
		}
		try {
			const response = await fetch(`${apiUrl}/api/user/search?nickname=${nickname}`, {
				method: "GET",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},	
			});
			const data = await response.json();
			if (data.exist) {
				receiver = data.user;
				return true;
			} else {
				return false;
			} 

		} catch (error) {
			console.error("실패:", error);
		}
		return false;
	}

	const initialInput = () => {		
		inputValue = "";
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
					<input id="find-input" type="text" placeholder="INPUT FRIEND NICKNAME" bind:value={inputValue} on:input={inputEvent} maxlength=10>
				</div>
			</div>
			<div class="bottom-line">
				<div class="find-result">
					{#if !isInviteButtonActivated}
						<div class="invite-check" >
							unavailable					
						</div>
					{:else}
						<div class="profile-container">
							<div class="image-container">
								<img class="profile-photo" src={receiver.avatar} alt={`${receiver.nickname}'s profile image`}>
							</div>
							<div>
								{receiver.nickname}
							</div>
						</div>
					{/if}
					
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
		z-index: 1;
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
		justify-content: top;

		width: 320px;
		height: 35px;
		background-color: var(--dark-color);        
		color: var(--border-color);
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

	.profile-container {
		display: flex;
		flex-direction: row;
		align-items: top;

		height: 35px;
	}

	.profile-photo {
		border-radius: 70%;
		width: 20px;
		height: 20px;

		margin-left: 3px;
		margin-right: 5px;
	}

	.image-container {
		display: flex;
		justify-content: center;
	}
  
</style>
  