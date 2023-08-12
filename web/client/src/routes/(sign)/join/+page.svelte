<script lang='ts'>
	import { onMount } from "svelte";
	import { myData } from "../../../store";
	import type { MyData } from '../../../interfaces';
	import { goto } from "$app/navigation";

	let isSigned: boolean = false;
	let isInvalidNickname: boolean = false;
	let block: boolean = false;
	let nickname: string = "";
	let profileSrc: string = "";

	const profileClickEvent = () => {
		(document.querySelector("#input-profile") as HTMLInputElement).click();
	};
	
	const fileUpload = async (e: any) => {
		profileSrc = e.target.files[0];
		
		/**
		 * @TODO
		 * 업로드한 이미지가 적절한지 확인
		 * 프로필 변경 API
		*/
	};

	const nicknameClickEvent = () => {
		block = true;
		nicknameSetAPI({data : {nickname}})
		.then((res) => {
			setTimeout(() => {
				if (res) {
					const status = res.status;
					if (status === 201) {
						goto('/');
					} else {
						isInvalidNickname = true;
						block = false;
					}
				}
			}, 1000)
		});
	};

	async function nicknameSetAPI(data: any) {
		try {
			const response = await fetch("http://localhost:3000/api/user/set/nickname", {
				method: "POST",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			return response;
		} catch (error) {
			console.error("실패:", error);
		}
	}

	const focusEvent = () => {
		isInvalidNickname = false;
	}

	onMount(() => {
		getMyData();
	});

	const getMyData = async (): Promise<void> => {
		try {
			const response = await fetch("http://localhost:3000/api/user/me", {
				method: "GET",
				credentials: 'include',
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.status !== 200) {
				goto("/signin");
				return;
			}
			const data: Promise<MyData> = response.json();
			$myData = await data;
			
			if ($myData.nickname) {
				goto("/");
			} else {
				isSigned = true;
			}
		} catch (error) {
			console.error("실패:", error);
		}
	}

</script>

{#if isSigned}
<button type="button" class="profile_image" on:click={profileClickEvent}>
	<img class="image" src={$myData.avatar} alt="profile image">
</button>
<input id="input-profile" type="file" accept="image/*" on:change={fileUpload} style="display: none;" />
<form>
	<input type="text"
		maxlength="10"
		placeholder="put your nickname"
		bind:value={nickname}
		on:focus={focusEvent}
		class={isInvalidNickname ? "invalid" : "valid"}
		disabled={block ? true : false}
		required>
	<button on:click={nicknameClickEvent} type="submit"></button>
</form>
{/if}

<style>
	.profile_image {
		width: 200px;
		height: 200px;
		border-radius: 70%;
		border: 1px solid var(--border-color);
		color: var(--text-color);
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 30px;
		overflow: hidden;
	}

	.profile_image:hover {
		border: 2px solid white;
		cursor: pointer;
		opacity: 0.5;
	}

	.profile_image > .image {
		width: 110%;
		height: 110%;
		object-fit: cover;
	}

	form {
		position: relative;
		display: flex;
		align-items: center;
	}

	.valid {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--intra-color);
		border: 2px solid var(--text-color);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	input:focus {
		outline: none;
		border: 2px solid var(--intra-color);
	}

	input:focus::placeholder {
		color: transparent;
	}

	.invalid {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--intra-color);
		border: 2px solid rgb(200, 0, 0);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	input[type=text]:disabled {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--border-color);
		caret-color: var(--border-color);
		border: 2px solid var(--border-color);
		box-sizing: border-box;
		background: none;
		font-weight: 400;
		text-align: center;
	}

	form > button {
		position: absolute;
		right: 10px;
		width: 20px;
		height: 20px;
		background-color: var(--text-color);
		border-radius: 70%;
		border-color: var(--point-color);
		margin: 0;
		padding: 0;
	
	}

	form > button:hover {
		background-color: var(--point-color);
		border-radius: 10%;
	}
</style>
