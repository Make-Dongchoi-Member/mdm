import { writable, type Writable } from 'svelte/store';
import type { MyData, GameSetting, ModalStates, Room, RoomDetail } from "./interfaces";
import { Level, RoomType } from './enums';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
const socketStore = writable(socket);

const myData: Writable<MyData> = writable({
	id: "seonhoki",
	avatarSrc: "/asset/hhwang.png",
	rooms: [
		{id: "123", name:'room name', roomtype: RoomType.lock, memberCount: 4},
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
	isProfileModal: false,
});

const openedRoom: Writable<RoomDetail> = writable({
	id: "tesroomid123",
	name: "testroomname",
	roomtype: RoomType.lock,
	memberCount: 4,
	members: new Map([
		["sooyokim", { user: {id: "sooyokim", avatarSrc: "/asset/default_profile.png"}, level: Level.admin, isMuted: true }],
		["seonhoki", { user: {id: "seonhoki", avatarSrc: "/asset/hhwang.png"}, level: Level.host, isMuted: false }],
		["dongchoi", { user: {id: "dongchoi", avatarSrc: "/asset/default_profile.png"}, level: Level.admin, isMuted: false }],
		["jaewchoi", { user: {id: "jaewchoi", avatarSrc: "/asset/default_profile.png"}, level: Level.member, isMuted: false }],
		["hhwang", { user: {id: "hhwang", avatarSrc: "/asset/hhwang.png"}, level: Level.member, isMuted: false }],
	]),
	history: [],
});

/*

	@API
	
	* 내 정보 API 요청
	GET("/api/user?id=[userid]")
	>> userId: string
	<< mydata: MyData

	* room List 목록 요청
	GET("/api/chat/list")
	>> userId: string
	<< rooms: Room[]

	* Chatting방 생성 API 요청
	POST("/api/chat/create")
	>> roomInfoDTO: RoomInfoDTO
	<< roomId: string
	
	* 들어간 방의 정보 API 요청
	POST("/api/chat/room")
	>> userId: string, roomId: string
	<< openedRoom: RoomDetail

	* 방 정보 수정 API 요청
	POST(/api/chat/room/update)
	>> roomInfoDTO: RoomInfoDTO
	<< result: boolean

	* 초대할 대상 존재 여부 확인 API 요청
	GET(/api/user/check?id=[userid])
	>> userId
	<< result: boolean

	* 방 나가기 API 요청
	POST(/api/chat/room/out)
	>> userId: string, roomId: string
	<< result: boolean

	(나중에)
	* profile 정보 API 요청
	GET
	>> userId: string
	<< result: profile 관련 interface(아직 미 생성함)

	* 방 들어가기 API 요청
	POST
	>> roomId: string, userId: string, password: string
	<< result: boolean
*/

export {
	gameSettingStore,
	modalStatesStore,
	myData,
	openedRoom,
	socketStore
}
