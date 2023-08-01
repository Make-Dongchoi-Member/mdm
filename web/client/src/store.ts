import { writable, type Writable } from 'svelte/store';
import type { MyData, GameSetting, ModalStates, Room, RoomDetail } from "./interfaces";
import { Level, RoomType } from './enums';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
const socketStore = writable(socket);

const myData: Writable<MyData> = writable({
	id: "",
	avatarSrc: "",
	rooms: [
		// {id: "123", name:'room name', roomtype: RoomType.lock, memberCount: 4},
		// {id: "456", name:'room name2', roomtype: RoomType.normal, memberCount: 999},
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
	isProfileModal: false,
});

const openedRoom: Writable<RoomDetail> = writable({
	id: "",
	name: "",
	roomtype: RoomType.NORMAL,
	memberCount: 0,
	members: new Map([
		// ["jaewchoi", { user: {id: "jaewchoi", avatarSrc: "/asset/default_profile.png"}, level: Level.member, isMuted: false }],
		// ["hhwang", { user: {id: "hhwang", avatarSrc: "/asset/hhwang.png"}, level: Level.member, isMuted: false }],
		// ["sooyokim", { user: {id: "sooyokim", avatarSrc: "/asset/default_profile.png"}, level: Level.admin, isMuted: true }],
		// ["seonhoki", { user: {id: "seonhoki", avatarSrc: "/asset/hhwang.png"}, level: Level.host, isMuted: false }],
		// ["dongchoi", { user: {id: "dongchoi", avatarSrc: "/asset/default_profile.png"}, level: Level.admin, isMuted: false }],
	]),
	history: [],
});

const myLevel: Writable<Level> = writable(Level.MEMBER);

/*

	@API
	
	* 내 정보 API 요청
	GET("/api/user?id=[userid]")
	>> userID: string
	<< mydata: MyData

	* room List 목록 요청
	GET("/api/chat/list")
	>> userID: string
	<< rooms: Room[]

	* Chatting방 생성 API 요청
	POST("/api/chat/create")
	>> roomInfoDTO: RoomInfoDTO
	<< roomID: string
	
	* 들어간 방의 정보 API 요청
	POST("/api/chat/room")
	>> userID: string, roomID: string
	<< openedRoom: RoomDetail

	* 방 정보 수정 API 요청
	POST(/api/chat/room/update)
	>> roomInfoDTO: RoomInfoDTO
	<< result: boolean

	* 초대할 대상 존재 여부 확인 API 요청
	GET(/api/user/check?id=[userid])
	>> userID
	<< result: boolean

	* 방 나가기 API 요청
	POST(/api/chat/room/out)
	>> userID: string, roomID: string
	<< result: boolean

	(나중에)
	* profile 정보 API 요청
	GET
	>> userID: string
	<< result: profile 관련 interface(아직 미 생성함)

	
*/

export {
	gameSettingStore,
	modalStatesStore,
	myData,
	openedRoom,
	socketStore,
	myLevel,
}
