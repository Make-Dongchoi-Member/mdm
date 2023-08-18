<script lang="ts">
	import { onMount } from 'svelte'
	import { modalStatesStore, myData, openedRoom } from '../../../../store';
	import { RoomType } from '../../../../enums';
	import type { RoomInfoDTO } from '../../../../interfaces';
	import { clickOutside, escapeKey } from '../../../../actions';

	let isPasswordChanged: boolean = false;
	let isMakeButtonActivation: boolean = false;	

	const initialRoomInfo: RoomInfoDTO = { 
		roomId: $openedRoom.roomId,
		hostId: $myData.id,
		roomname: $openedRoom.roomname,
		password: "initialpw",
		roomtype: $openedRoom.roomtype,
	};    
	export let roomNameInputValue: string = $openedRoom.roomId;
	export let roomtype: RoomType =$openedRoom.roomtype;
	export let isPrivate: boolean = $openedRoom.roomtype === RoomType.PRIVATE;
	export let isPassword: boolean = $openedRoom.roomtype === RoomType.LOCK;  
	export let passwordInput: string = $openedRoom.roomtype === RoomType.LOCK ? "initialpw" : "" ;
	
	async function changeRoom(data: any) {
		const response = await fetch("http://localhost:3000/api/chat/room/update", {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
		.then( () => {
			$openedRoom.roomname = roomNameInputValue;
			$openedRoom.roomtype = roomtype;
			initialRoomInfo.roomname = roomNameInputValue;
			initialRoomInfo.roomtype = roomtype;
			$modalStatesStore.isSettingModal = false;
		})
		.catch(error => console.error('Error:', error));
	}
	
	onMount(() => {
		const makeButton = document.querySelector(".make-button") as HTMLButtonElement;        
		makeButton.disabled = !isMakeButtonActivation;
	});

	const closeButtonEvent = () => {        
		initialInput();
		$modalStatesStore.isSettingModal = false;
	}

	const changeButtonEvent = () => {
			/*
					@TODO
					방 설정을 위해 필요한 입력 체크
					방 설정 변경 API 요청
			*/
		roomtype = RoomType.NORMAL;
		if (isPassword && !isPrivate) {
			roomtype = RoomType.LOCK;
		} else if (!isPassword && isPrivate) {
			roomtype = RoomType.PRIVATE;
		}

		const roomInfo: RoomInfoDTO = {		
			roomId: $openedRoom.roomId,
			hostId: $openedRoom.hostId,
			roomname: roomNameInputValue,
			password: isPasswordChanged ? passwordInput : "",
			roomtype: roomtype,
		}
		changeRoom({data: {roomInfo}});
	}

	const roomnameInputBoxEvent = (e: any) => {
		roomNameInputValue = e.target.value.trim();
		isMakeButtonActivation = makeButtonActivationEvent();
	}

	const passwordInputBoxEvent = (e: any) => {    
		e.target.value = e.target.value.replace(/\s/g, '');
		passwordInput = e.target.value;
		isMakeButtonActivation = makeButtonActivationEvent();      
	}

	const passwordInitialEvent = (e: any) => {
		if (e.target.value === "initialpw") {
			e.target.value = "";
		}
		isPasswordChanged = true;
	}

	const privateButtonToggle = () => {		
		isPrivate = !isPrivate;
		if (isPrivate) {
			passwordInput = "";
		}
		isPassword = false;
		isPasswordChanged = false;
		isMakeButtonActivation = makeButtonActivationEvent();            
	}

	const passwordButtonToggle = () => {
		isPassword = !isPassword;
		if (!isPassword) {
			passwordInput = "";
			isPasswordChanged = false;
		}
		if (initialRoomInfo.roomtype === RoomType.LOCK && isPassword) {
			passwordInput = initialRoomInfo.password;
		}
		isPrivate = false;         
		isMakeButtonActivation = makeButtonActivationEvent();		
	}

	const makeButtonActivationEvent = () => {
		if (!isPassword && ((initialRoomInfo.roomtype === RoomType.PRIVATE && !isPrivate)
				|| (initialRoomInfo.roomtype !== RoomType.PRIVATE && isPrivate))) {
			return true;
		}
		if ((initialRoomInfo.roomtype === RoomType.LOCK && !isPassword)
				|| (initialRoomInfo.roomtype !== RoomType.LOCK && isPassword && passwordInput !== "")
				|| (passwordInput !== "" && isPasswordChanged)
				) {
			return true;
		}
		if (roomNameInputValue === "" || roomNameInputValue === initialRoomInfo.roomname) {
			return false;
		}
		if (isPassword && passwordInput === "") {
			return false;
		}
		return true;            
	}
	const initialInput = () => {
		isMakeButtonActivation = false;
		initialRoomInfo.roomtype === RoomType.PRIVATE ? isPrivate = true : isPrivate = false;
		initialRoomInfo.roomtype === RoomType.LOCK? isPassword = true : isPassword = false;
		roomNameInputValue = initialRoomInfo.roomname;
		passwordInput = initialRoomInfo.roomtype === RoomType.LOCK ? initialRoomInfo.password : "";		
	}

</script>

	<div class="modal-container" 
		style="{$modalStatesStore.isSettingModal ? 'display: block;' : 'display: none;'}"
		use:clickOutside on:outclick={() => {$modalStatesStore.isSettingModal = false; initialInput();}}
		use:escapeKey on:esckey={() => {$modalStatesStore.isSettingModal = false; initialInput();}}>
    <div class="modal-title">
			<div>
				YOUR CHAT ROOM
			</div>
			<div class="close-button">
				<button on:click={closeButtonEvent}>&#215;</button>
			</div>
    </div>
    <div class="modal-content">
			<div class="room-name">
				<div class="room-name-input">
					<input 
						class="roomname-inputbox"
						on:input={roomnameInputBoxEvent}
						bind:value={roomNameInputValue}
						type="text" 
						placeholder="ROOM NAME" 
						maxlength=20
						>
				</div>
				<div>
					<button 
							on:click={privateButtonToggle}
							class={isPrivate ? "private-button able" : "private-button disable"}
							>
							PRIVATE
					</button>
				</div>
			</div>
			<div class="room-option">
				<div class="password-option">
					<input 
						class="password-inputbox"
						disabled={isPrivate || !isPassword ? true : false}
						on:input={passwordInputBoxEvent}
						bind:value={passwordInput}                    
						on:click={passwordInitialEvent}                    
						type="password" 
						placeholder="PASSWORD IF YOU NEED" 
						maxlength=10                    
						>
				</div>
				<div>
					<button 
							on:click={passwordButtonToggle}
							class={isPassword ? "password-button able" : "password-button disable"}
							>
							PASSWORD
					</button>
				</div>
				<button 
					class={isMakeButtonActivation ? 'make-button able' : 'make-button disable'}
					disabled={isMakeButtonActivation ? false : true}
					on:click={changeButtonEvent}
					>
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

		margin-right: 20px;
	}

	.room-name {
		display: flex;
		flex-direction: row;
		align-items: center;

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
		text-align: center;

		width: 100px;
		height: 39px;
		border: 1px solid var(--border-color);
		margin-left: 20px;
	}

	.private-button.able {
		background-color: var(--hover-color);
		border: 1px solid var(--point-color);
	}

	.private-button.disable {
		background-color: var(--bg-color);
		border: 1px solid var(--border-color); 
	}

	.private-button.disable:hover {
		background-color: var(--hover-color);
	}
	
	.room-option {
		display: flex;
		flex-direction: row;
		align-items: center;         
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

	.password-button {
		width: 100px;
		height: 39px;

		text-align: center;        
		border: 1px solid var(--border-color);
		margin-left: 20px;
	}


	.password-button.able {
		background-color: var(--hover-color);
		border: 1px solid var(--point-color);
	}

	.password-button.disable {
		background-color: var(--bg-color);
		border: 1px solid var(--border-color); 
	}

	.password-button.disable:hover {
		background-color: var(--hover-color);
	}

	.make-button {
		width: 100px;
		height: 39px;
		border: 1px solid var(--border-color);        
		
		text-align: center;
		margin-left: 175px;
	}    

	.make-button.able:hover {
		background-color: var(--hover-color);
	}

	.make-button.disable {
		color: var(--border-color);
	}

	.make-button.disable:hover {
		background-color: var(--bg-color);
	}
  
</style>
  