<script lang="ts">
</script>

<div class="match_count_area">
	<div>
		plays
		<span>10000</span>
	</div>
	<div class="division_line"></div>
	<div>
		wins
		<span>4242</span>
	</div>
	<div>
		losses
		<span>5758</span>
	</div>
</div>
<div class="win_rate_area">
	win rate
	<span>42.42%</span>
</div>

<style>
	.match_count_area {
		height: 50%;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		text-align: center;
		margin-top: 30px;
	}

	.match_count_area > div {
		display: flex;
		flex-direction: column;
		font-size: 20px;
		font-weight: 100;
		color: var(--border-color);
	}
	
	.match_count_area > div > span {
		font-size: 30px;
		color: var(--text-color);
		margin-top: 10px;
	}

	.division_line {
		border-left: 1px solid var(--border-color);
		height: 80px;
		margin: 0;
		padding: 0;
	}

	.win_rate_area {
		height: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		border: 1px solid var(--border-color);
		font-size: 20px;
		font-weight: 100;
		color: var(--text-color);
		margin: 20px;
	}

	.win_rate_area > span {
		font-size: 30px;
		color: var(--point-color);
		padding-top: 7px;
	}
</style>
