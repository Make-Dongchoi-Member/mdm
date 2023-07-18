import {writable, type Writable} from 'svelte/store';

interface GameSetting {
	gameMode: string;
	barColor: string;
	ballShape: string;
}

interface ModalStates {
	isNotiModal: boolean;
	isInviteModal: boolean;
	isSettingModal: boolean;
	isRoomoutModal: boolean;
	isRoomCreateModal: boolean;
}

interface UserData {
	id: string;
	avatarSrc: string;
}

const myData: Writable<UserData> = writable({
	id: "seonhoki",
	avatarSrc: "/asset/hhwang.png",
})

const gameSettingStore: Writable<GameSetting> = writable({
	gameMode: "basic",
	barColor: "#FF6231",
	ballShape: "square",
});

const ModalStatesStore: Writable<ModalStates> = writable({
	isNotiModal: false,
	isInviteModal: false,
	isSettingModal: false,
	isRoomoutModal: false,
	isRoomCreateModal: false,
})

export {
	gameSettingStore,
	ModalStatesStore,
	myData
}
