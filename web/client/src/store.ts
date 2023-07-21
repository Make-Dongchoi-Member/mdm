import {writable, type Writable} from 'svelte/store';
import type { MyData, GameSetting, ModalStates, Room, RoomDetail } from "./interfaces";
import { Level, RoomType } from './enums';

const myData: Writable<MyData> = writable({
	id: "seonhoki",
	avatarSrc: "/asset/hhwang.png",
	rooms: [
        {id: "123", name:'room name', roomtype: RoomType.normal, memberCount: 4},
        {id: "456", name:'room name2', roomtype: RoomType.normal, memberCount: 999},
    ],
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

const openedRoom: Writable<RoomDetail> = writable({
	id: "tesroomid123",
	name: "testroomname",
	roomtype: RoomType.normal,
	memberCount: 4,
	members: new Map([
		["sooyokim", { user: {id: "sooyokim", avatarSrc: "/asset/hhwang.png"}, level: Level.admin, isMuted: false }],
		["seonhoki", { user: {id: "seonhoki", avatarSrc: "/asset/hhwang.png"}, level: Level.host, isMuted: false }],
		["dongchoi", { user: {id: "dongchoi", avatarSrc: "/asset/default_profile.png"}, level: Level.member, isMuted: false }],
	]),
	history: [
        { sender: {id: "seonhoki", avatarSrc: "/asset/hhwang.png"}, body: "kick the dongchoi man~", isDM: false, date: "10:00" },
        { sender: {id: "sooyokim", avatarSrc: "/asset/hhwang.png"}, body: "kick the dongchoi man~ kick the dongchoi man, kick the dongchoi man, kick the dongchoi man, kick the dongchoi man", isDM: false, date: "10:00" },
        { sender: {id: "sooyokim", avatarSrc: "/asset/hhwang.png"}, body: "kick the dongchoi man~", isDM: true, date: "10:00" },
        { sender: {id: "sooyokim", avatarSrc: "/asset/hhwang.png"}, body: "kick the dongchoi man~", isDM: false, date: "10:00" },
    ],
});

/*

	@API
	
	Login 이후 ("/") ============================================
	* 내 정보 API 요청
	GET
	>> id: string
	<< mydata: MyData

	Chatroom List ("/chat") ============================================
	* Chatting방 생성 요청
	POST
	>> roomInfoDTO: RoomInfoDTO
	<< result: boolean
	
	Chatroom 내부 ("/chat/room") ============================================
	* 들어간 방의 정보 API 요청
	POST
	>> userId: string, roomID: string
	<< openedRoom: RoomDetail


	
*/

export {
	gameSettingStore,
	modalStatesStore,
	myData,
	openedRoom
}
