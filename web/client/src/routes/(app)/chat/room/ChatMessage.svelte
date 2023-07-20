<script lang="ts">
    import { onMount } from 'svelte';
	import { myData } from '../../../../store';
    import type { Message } from '../../../../interfaces';

	let messageHistory: Message[] = [
        { sender: "seonhoki", body: "kick the dongchoi man~", isDM: false, avatarSrc: "/asset/hhwang.png", date: "10:00" },
        { sender: "dongchoi", body: "kick the dongchoi man~ kick the dongchoi man, kick the dongchoi man, kick the dongchoi man, kick the dongchoi man", isDM: false, avatarSrc: "/asset/hhwang.png", date: "10:00" },
        { sender: "seonhoki", body: "kick the dongchoi man~", isDM: true, avatarSrc: "/asset/hhwang.png", date: "10:00" },
        { sender: "seonhoki", body: "kick the dongchoi man~", isDM: false, avatarSrc: "/asset/hhwang.png", date: "10:00" },
    ];

    let inputValue: string = "";


    onMount(() => {
        document.body.addEventListener("keypress", enterKeyPressEvent);

        /*
            @TODO
            메시지 기록 API 요청
            나의 상태 API 요청
            나의 상태에 따라서 채팅 막혀야함.
        */
    });

    const enterKeyPressEvent = (e: any) => {
        if (e.code === "Enter") {
            sendButtonEvent();
        }
    }

    const sendButtonEvent = () => {
        if (inputValue === "") {
            return ;
        }
        
        const newMessage: Message = {
            sender: $myData.id,
            body: inputValue,
            isDM: false,
            avatarSrc: $myData.avatarSrc,
            date: "10:00"
        };

        /*
            @TODO
            메시지 SOCKET 요청
        */

        messageHistory = [...messageHistory, newMessage];
        inputValue = "";
        
        setTimeout(() => {
            const chattingBox =  document.querySelector(".chatting-box") as HTMLDivElement;
            chattingBox.scrollTop = chattingBox.scrollHeight;
            
            const inputTag =  document.querySelector("#chat-input") as HTMLInputElement;
            inputTag.focus();
        }, 1);
    }

</script>

<div class="chat-main-box">
	<div class="chatting-box">
		{#each messageHistory as message}
			<div class={$myData.id === message.sender ? "chatting my-message" : "chatting"}>
				<div>
					<img src="{message.avatarSrc}" alt="프로필 이지미" class="chatting-box-avatar">
				</div>
				<div>
					<div>
						<div>
							{message.sender}
						</div>
						<div>
							10:00
						</div>
					</div>
					<div>
						{message.body}
					</div>
				</div>
			</div>
		{/each}
		
	</div>
	<div class="chat-send-box">
		<div>
			<input bind:value={inputValue} id="chat-input" type="text" placeholder="chat here">
		</div>
		<button on:click={sendButtonEvent} class="send-button">
			&#9655;
        </button>
	</div>
</div>

<style>
	.chat-main-box {        
        width: 540px;
        height: 380px;
        margin-left: 10px;
        margin-right: 10px;
        border: 1px solid var(--border-color);
    }

	.chatting-box-avatar {
        border-radius: 50px;
        width: 40px;
        height: 40px;

        margin-right: 10px;
    }

	.chatting-box {
        height: 325px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .chatting-box::-webkit-scrollbar {
        width: 6px;
        height: 30px;
    }

    .chatting-box::-webkit-scrollbar-track {
        background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
    }

    .chatting-box::-webkit-scrollbar-thumb {
        background-color: #D9D9D9; /* 스크롤바 썸바 배경색 설정 */
        border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
    }

    .chatting-box::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* 스크롤바 썸바 호버 배경색 설정 */
    }

	.chatting {
        display: flex;
        flex-direction: row;
        text-align: left;
        word-break: break-all;
        margin: 10px;
    }
    
    .chatting > div:nth-child(2) {
        display: flex;
        flex-direction: column;

    }

    .chatting > div:nth-child(2) > div:nth-child(1) {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .chatting > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
        font-size: 18px;
        font-weight: 400;
        margin-right: 10px;
    }

    .chatting > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) {
        font-size: 12px;
        margin-right: 10px;
    }

    .my-message {
        color: var(--point-color);
    }

	.chat-send-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border-color);
        height: 30px;
        margin-top: 10px;
        width: 500px;
        margin-left: 20px;
    }

    .chat-send-box > div > input {
        width: 430px;
        height: 27px;
        background-color: var(--bg-color);
        border: none;
        color: var(--font-color);  
    }

    .send-button {
        width: 40px;
        background-color: var(--bg-color);
        color: var(--text-color);        
        text-align: center;
        outline: none;
        border: none;
    }
</style>
