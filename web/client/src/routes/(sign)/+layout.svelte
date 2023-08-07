<script lang="ts">
</script>

<div class="container">
	<slot></slot>
</div>

<style>
	@import url('https://rsms.me/inter/inter.css');
	:global(*) { 
		font-family: 'Inter', sans-serif;
		font-weight: 200;
		font-size: 16px;
	}

	:root {
		--bg-color: #424242;
		--intra-color: #00BABC;
		--text-color: #d2d2d2;
		--border-color: #848484;
		--point-color: #FF6231;
		--hover-color: rgba(255, 98, 49, 0.4);
	}

	:global(body) {
		background-color: var(--bg-color);
		color: var(--text-color);
		width: 100vw;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.container {
		width: 800px;
		height: 650px;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>
