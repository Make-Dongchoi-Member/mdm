<script lang="ts">
	import type { Record } from "../../../interfaces";

	export let records: Record[] = [];

	function formatDate(d: Date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayName = days[d.getDay()];
    const monthName = months[d.getMonth()];
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return `${dayName} ${monthName} ${day} ${hours}:${minutes}`;
	}
</script>

<div class="data">
	{#each records as item}
	<div class="history">
		{#if item.win}
			<div class="win">
				WIN
			</div>
		{:else}
			<div class="lose">
				LOSE
			</div>
		{/if}
		<div>
			{formatDate(new Date(item.date))}
		</div>
		<div>
			<span class="simple-text">vs</span>
			<span class="nickname_text">{item.enemy}</span>
		</div>
	</div>	
	{/each}
</div>

<style>
	/* scroll bar */

	.data::-webkit-scrollbar {
		width: 6px;
		height: 30px;
	}

	.data::-webkit-scrollbar-track {
		background-color: var(--bg-color); /* 스크롤바 트랙 배경색 설정 */
	}

	.data::-webkit-scrollbar-thumb {
		background-color: var(--border-color); /* 스크롤바 썸바 배경색 설정 */
		border-radius: 4px; /* 스크롤바 썸바 테두리 설정 */
	}

	.data::-webkit-scrollbar-thumb:hover {
		background-color: var(--text-color) /* 스크롤바 썸바 호버 배경색 설정 */
	}

	/* scroll bar */

	.data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
		width: 775px;
		height: 300px;
		overflow-y: auto;
		margin: 10px 10px 10px 15px;
	}

	.history {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;

		height: 45px;
		width: 775px;
		margin-right: 10px;
		margin-bottom: 10px;
		outline: none;
		border: 1px solid var(--border-color);
		background-color: var(--bg-color);
		color: var(--text-color);
	}

	.history > :nth-child(2) {
		justify-content: flex-start;
		margin-left: 20px;
		margin-right: 20px;
	}

	.history > :nth-child(3) {
		position: absolute;
		right: 20px;
		text-align: right;
		margin-left: 20px;
	}

	.simple-text {
		color: var(--border-color);
	}

	.nickname_text {
		font-size: 20px;
	}

	.win {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 120px;
		height: 30px;
		border: 1px solid var(--point-color);
		margin-left: 20px;
		margin-right: 20px;
	}

	.lose {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 120px;
		height: 30px;
		border: 1px solid var(--border-color);
		color: var(--border-color);
		margin-left: 20px;
		margin-right: 20px;
	}
</style>
