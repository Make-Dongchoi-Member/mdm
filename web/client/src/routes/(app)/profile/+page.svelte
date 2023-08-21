<script lang="ts">
	import ProfileHistory from "./ProfileHistory.svelte";
	import MyInfo from "./MyInfo.svelte";
	import LogoutModal from "./LogoutModal.svelte";
	import NicknameModal from "./NicknameModal.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { MyData, Record } from "../../../interfaces";
  import { apiUrl, myData } from "../../../store";

	let records: Record[] = [];
	onMount(() => {
		getMyData();
	})

	const getMyData = async (): Promise<void> => {
		try {
			const response = await fetch(`${apiUrl}/api/user/me`, {
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
</style>
