<script lang="ts">
	async function logJSONData() {
		const response = await fetch("http://localhost:3000/login");
		const jsonData = await response.json();
		console.log(jsonData);
	}
</script>

<div class="logo">
	LOGO
</div>
<button on:click={ logJSONData }>LOGIN WITH 42</button>


<style>
	.logo {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		border: 1px solid var(--border-color);
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 30px;
	}

	button {
		width: 300px;
		height: 45px;
		margin: 0;
		padding: 0;
		outline: none;
		color: var(--text-color);
		background-color: var(--bg-color);
		border: 2px solid var(--text-color);
		font-weight: 400;
	}

	button:hover {
		background-color: var(--intra-color);
	}

</style>
