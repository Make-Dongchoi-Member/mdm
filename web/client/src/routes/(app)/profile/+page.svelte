<script lang="ts">
import ProfileSocialModal from "./ProfileSocialModal.svelte";
import ProfileHistoryModal from "./ProfileHistoryModal.svelte";
import ProfileSocial from "./history/ProfileSocial.svelte";
import MyInfo from "./history/MyInfo.svelte";
import {profilePageSettingStore} from '../../../store';

interface tabButtons {
	social: boolean;
	history: boolean;
}

let tabButtonSet: tabButtons = {
	social: true,
	history: false,
};

const profileTabEvent = (e: any) => {
	$profilePageSettingStore.whichTab = e.target.value;
	console.log($profilePageSettingStore.whichTab);
}
</script>

<ProfileSocialModal />
<ProfileHistoryModal />

<div class="info_container">
	<MyInfo />
</div>
<div class="data_container">
	<div class="button_area">
		<button on:click={ profileTabEvent } value="social">SOCIAL</button>
		<button on:click={ profileTabEvent } value="history">HISTORY</button>
	</div>
	<ProfileSocial />
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

	button {
		width: 150px;
		margin-right: 15px;
	}
</style>
