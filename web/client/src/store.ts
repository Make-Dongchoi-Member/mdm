import {writable, type Writable} from 'svelte/store';
import type { MyData, GameSetting, ModalStates } from "./interfaces";

const myData: Writable<MyData> = writable({
	id: "dongchoi",
	avatarSrc: "/asset/hhwang.png",
	rooms: []
});

const gameSettingStore: Writable<GameSetting> = writable({
	gameMode: "basic",
	barColor: "#FF6231",
	ballShape: "square",
});

const modalStatesStore: Writable<ModalStates> = writable({
	isNotiModal: false,
	isInviteModal: false,
	isSettingModal: false,
	isRoomoutModal: false,
	isRoomCreateModal: false,
});

/*

	@TODO
	내 정보 API 요청
	내가 참여한 방 목록
	현재 보고있는 방에서 나의 상태
	
*/

export {
	gameSettingStore,
	modalStatesStore,
	myData
}
