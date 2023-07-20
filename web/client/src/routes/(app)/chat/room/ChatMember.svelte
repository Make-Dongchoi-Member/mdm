<script lang="ts">
	import { myData } from '../../../../store';
	import ProfileButton from './ProfileButton.svelte';
	import type { Profile } from '../../../../interfaces';
	import { Level } from '../../../../enums';
    import { onMount } from 'svelte';

    const membersExample = [
		{ id: "sooyokim", avatarSrc: "/asset/hhwang.png", level: Level.admin },
        { id: "seonhoki", avatarSrc: "/asset/hhwang.png", level: Level.host },
        { id: "dongchoi", avatarSrc: "/asset/default_profile.png", level: Level.member },
    ];

    let members = new Map<string, Profile>();
	let myLevel: Level;

	onMount(() => {
		/*
			@TODO
			방에 속해있는 멤버 리스트 API 요청
		*/
	});

    for (let i = 0; i < membersExample.length; i++) {
        members.set(membersExample[i].id, membersExample[i]);
    }
	
</script>

<div class="members">
	<div class="my-profile-container">
		<div class="my-profile">
			<div class="image-container">
				<img src="{$myData.avatarSrc}" alt="프로필 이미지" class="profile-photo">
			</div>
			<div class="profile-id">
				{$myData.id}
			</div>
			{#if members.get($myData.id)?.level == Level.host}
				<div>&#128081;</div>
			{:else if members.get($myData.id)?.level == Level.admin}
				<div>&#128736;</div>
			{:else if members.get($myData.id)?.level == Level.member}
				<div></div>
			{/if}
		</div>
	</div>
	<div class="other-profile-container">
		{#each Array.from(members) as [key, value]}
			{#if key !== $myData.id}
				<ProfileButton {key} {value} {myLevel} />
			{/if}
		{/each}
	</div>
	

</div>

<style>
	.members {
        width: 220px;
        height: 380px;
        margin-left: 10px;
        margin-right: 10px;
        border: 1px solid var(--border-color);
		font-size: 12px;
    }

	.profile-id {
		font-size: 12px;
	}

	.my-profile-container {
		margin-bottom: 20px;
	}

    .my-profile {
        width: 90%;
		height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border-color);
		padding: 4px 10px 4px 10px;
		margin: 5%;
		box-sizing: border-box;
    }

	.my-profile > :nth-child(2) {
		width: 100%;
		padding-left: 10px;
	}

	.other-profile-container {
		display: flex;
		flex-direction: column;
		height: 78%;
		overflow-y: auto;
	}

    .other-profile-container::-webkit-scrollbar {
        width: 6px;
        height: 30px;
    }

    .other-profile-container::-webkit-scrollbar-track {
        background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
    }

    .other-profile-container::-webkit-scrollbar-thumb {
        background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
        border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
    }

    .other-profile-container::-webkit-scrollbar-thumb:hover {
        background-color: var(--text-color) /* 스크롤바 썸바 호버 배경색 설정 */
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
