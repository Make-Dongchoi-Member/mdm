<script lang="ts">
	import MyInfo from "./MyInfo.svelte";
    import ProfileHistory from "./ProfileHistory.svelte";
</script>

<div class="info_container">
	<MyInfo />
</div>
<div class="data_container">
	<div class="button_area">
		<nav>
			<a href="/profile">SOCIAL</a>
			<a href="/profile/history">HISTORY</a>
		</nav>
	</div>
	<ProfileHistory />
</div>

<style>
	.info_container {
		display: flex;
		flex-direction: row;
		border: 1px solid var(--border-color);
		height: 250px;
	}

	.data_container {
		border: 1px solid var(--border-color);
		height: 380px;
		margin-top: 20px;
	}

	.button_area {
		display: flex;
		flex-direction: row;
		width: 750px;
		height: 30px;
		margin: 20px 10px 10px 15px;
	}

	nav {
		display: flex;
	}

	nav > a {
		width: 150px;
		/* height: 30px; */
		border: 1px solid var(--border-color);
		text-align: center;
		color: var(--text-color);
		background-color: var(--bg-color);
		padding-top: 5px;
		text-decoration: none;
		margin-right: 15px;
	}

	nav > a:hover {
		background-color: var(--hover-color);
	}
</style>
