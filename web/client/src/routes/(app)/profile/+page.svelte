<script lang="ts">
	import ProfileHistory from "./ProfileHistory.svelte";
	import MyInfo from "./MyInfo.svelte";
	import LogoutModal from "./LogoutModal.svelte";
	import NicknameModal from "./NicknameModal.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { MyData, Record } from "../../../interfaces";
  import { myData } from "../../../store";

	let records: Record[] = [];
	onMount(() => {
		getMyData();
	})

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
			$myData = $myData;
			records = $myData.record as Record[];
			console.log("$myData", $myData);
			
		} catch (error) {
			console.error("실패:", error);
		}
	}
</script>

<LogoutModal />
<NicknameModal />

<div class="info_container">
	<MyInfo {records} />
</div>
<div class="data_container">
	<div class="button_area">
		<div>HISTORY</div>
	</div>
	<ProfileHistory {records} />
</div>

<style>
	.info_container {
		display: flex;
		flex-direction: row;
		border: 1px solid var(--border-color);
		height: 250px;
		box-sizing: border-box;
	}

	.data_container {
		border: 1px solid var(--border-color);
		height: 380px;
		margin-top: 20px;
		box-sizing: border-box;
	}

	.button_area {
		display: flex;
		flex-direction: row;
		width: 750px;
		height: 30px;
		margin: 20px 10px 10px 15px;
	}

	button {
		width: 150px;
		margin-right: 15px;
	}
</style>
