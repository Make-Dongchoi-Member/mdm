<script lang="ts">
	enum Level {
        "host",
        "admin",
        "member"
    }

	interface Profile {
        id: string;
        avatarSrc: string;
        level: Level;
    }
	
	export let key: string;
	export let value: Profile;
	export let myLevel: Level;
	
	let isClicked: boolean = false;

	const menuShowEvent = () => {
		isClicked = !isClicked;
	}

	const profileClickEvent = () => {
		console.log("ccc");
	}

</script>

<div class="other-profile">
	<button on:click={menuShowEvent} class="profile-button">
		<div class="image-container">
			<img src="{value.avatarSrc}" alt="프로필 이미지" class="profile-photo">
		</div>
		<div class="profile-id">
			{key}
		</div>
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
				<button on:click={profileClickEvent}>ADMIN</button>
			{/if}
			{#if myLevel === Level.host || myLevel === Level.admin}
				<button on:click={profileClickEvent}>MUTE</button>
				<button on:click={profileClickEvent}>KICK</button>
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
		width: 100%;
		padding-left: 10px;
		text-align: left;
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
