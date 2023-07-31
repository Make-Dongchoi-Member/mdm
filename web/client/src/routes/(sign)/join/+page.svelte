<script lang='ts'>
	let nickname: string = "";
	let profileSrc: string = "/asset/default_profile.png";

	const profileClickEvent = () => {
		(document.querySelector("#input-profile") as HTMLInputElement).click();
	};

	const fileUpload = async (e: any) => {
		profileSrc = e.target.files[0];
		console.log(profileSrc);
		
		/**
		 * @TODO
		 * 업로드한 이미지가 적절한지 확인
		 * 프로필 변경 API
		*/
	};

	const nicknameClickEvent = () => {
		console.log(nickname);

		/**
		 * @TODO
		 * 닉네임이 적절한지 확인
		 * 닉네임 변경 API
		*/
	};

</script>

<button type="button" class="profile_image" on:click={profileClickEvent}>
	<img class="image" src={profileSrc} alt="profile image">
</button>
<input id="input-profile" type="file" accept="image/*" on:change={fileUpload} style="display: none;" />
<form>
	<input type="text" maxlength="10" placeholder="put your nickname" bind:value={nickname} required>
	<button on:click={nicknameClickEvent} type="submit"></button>
</form>

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

	input[type=text] {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		color: var(--text-color);
		caret-color: var(--point-color);
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
