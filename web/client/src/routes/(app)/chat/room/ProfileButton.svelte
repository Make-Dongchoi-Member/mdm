<script lang="ts">
	import type { Profile, SetRequestDTO } from '../../../../interfaces';
	import { Level } from '../../../../enums';
    import { myData, socketStore } from '../../../../store';
    import { page } from '$app/stores';
    import { onDestroy } from 'svelte';
	
	export let key: string;
	export let value: Profile;
	export let myLevel: Level;
	
	let isClicked: boolean = false;

	const requestData: SetRequestDTO = {
		roomId: $page.url.searchParams.get("id") as string,
		userId: $myData.id,
		targetId: value.user.id
	}

	const menuShowEvent = () => {
		isClicked = !isClicked;
	}

	const profileClickEvent = () => {
		/*
			@TODO
			프로필 모달을 띄워줌
		*/
	}

	const adminClickEvent = () => {
		/*
			@TODO
			관리자 권한 SOCKET 요청
		*/
		if (value.level === Level.member) {
			$socketStore.emit("chat/set-admin", requestData);
		} else if (value.level === Level.admin) {
			$socketStore.emit("chat/unset-admin", requestData);
		}
	}

	const muteClickEvent = () => {
		/*
			@TODO
			채팅금지 SOCKET 요청
		*/
		if (myLevel === Level.member) return ;
		if (myLevel === Level.admin && value.level !== Level.member) return ;
		if (!value.isMuted) {
			$socketStore.emit("chat/set-mute", requestData);
		} else {
			$socketStore.emit("chat/unset-mute", requestData);
		}
	}

	const kickClickEvent = () => {
		/*
			@TODO
			강퇴 SOCKET 요청
		*/
		if (myLevel === Level.member) return ;
		if (myLevel === Level.admin && value.level !== Level.member) return ;
		$socketStore.emit("chat/set-kick", requestData);
	}

	onDestroy(() => {
		isClicked = false;
	})

</script>

<div class="other-profile">
	<button on:click={menuShowEvent} class="profile-button">
		<div class="image-container">
			<img src="{value.user.avatarSrc}" alt="프로필 이미지" class="profile-photo">
		</div>
		<div class="profile-id">
			{key}
		</div>
		{#if value.isMuted}
			<div>&#128263;</div>
		{:else}
			<div></div>
		{/if}
		{#if value.level == Level.host}
			<div>&#128081;</div>
		{:else if value.level == Level.admin}
			<div>&#128736;</div>
		{:else if value.level == Level.member}
			<div></div>
		{/if}
	</button>
	{#if isClicked}
		<div class="menu-list">
			<button on:click={profileClickEvent}>PROFILE</button>
			{#if myLevel === Level.host}
				<button on:click={adminClickEvent}>ADMIN</button>
			{/if}
			{#if (myLevel === Level.host || (myLevel === Level.admin && value.level === Level.member))}
				<button on:click={muteClickEvent}>MUTE</button>
				<button on:click={kickClickEvent}>KICK</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.profile-button {
        width: 90%;
		height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border-color);
		padding: 4px 10px 4px 10px;
		margin: 0 5% 5% 5%;
		box-sizing: border-box;
    }

	.profile-id {
		font-size: 12px;
	}

	.profile-button > :nth-child(2) {
		/* width: 100%; */
		flex-basis: 120px;
		padding-left: 10px;
		text-align: left;
	}

	.profile-button > :nth-child(3) {
		flex-basis: 20px;
		text-align: center;
		padding-right: 3px;
	}

	.profile-button > :nth-child(4) {
		flex-basis: 20px;
	}

	.menu-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 5% 5% 5%;
	}

	.menu-list > button {
		width: 49%;
		font-size: 12px;
		margin-bottom: 2%;
	}

	.profile-photo {
        border-radius: 70%;
        width: 20px;
		height: 20px;
    }

	.image-container {
		display: flex;
		justify-content: center;
	}
</style>
