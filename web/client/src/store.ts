import { writable, type Writable } from "svelte/store";
import type {
  MyData,
  GameSetting,
  ModalStates,
  Room,
  RoomDetail,
  RoomList,
} from "./interfaces";
import { Level, RoomType } from "./enums";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false,
});
const socketStore = writable(socket);

const myData: Writable<MyData> = writable({
  id: "",
  avatar: "",
  nickname: "",

  rooms: [],
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
  isPasswordInputModal: false,
  isLogoutModal: false,
  isNicknameModal: false,
});

const openedRoom: Writable<RoomDetail> = writable({
  roomId: "",
  hostId: "",
  myLevel: Level.MEMBER,
  roomname: "",
  roomtype: RoomType.NORMAL,
  memberCount: 0,
  members: new Map([
    // ["jaewchoi", { user: {id: "jaewchoi", avatar: "/asset/default_profile.png", nickname: "jaewchoi"}, level: Level.MEMBER, isMuted: false }],
    // ["hhwang", { user: {id: "hhwang", avatar: "/asset/hhwang.png", nickname: "hhwang"}, level: Level.MEMBER, isMuted: false }],
    // ["sooyokim", { user: {id: "sooyokim", avatar: "/asset/default_profile.png", nickname: "sooyokim"}, level: Level.ADMIN, isMuted: true }],
    // ["seonhoki", { user: {id: "seonhoki", avatar: "/asset/hhwang.png", nickname: "seonhoki"}, level: Level.HOST, isMuted: false }],
    // ["dongchoi", { user: {id: "dongchoi", avatar: "/asset/default_profile.png", nickname: "dongchoi"}, level: Level.ADMIN, isMuted: false }],
  ]),
  history: [],
});

const roomList: Writable<RoomList> = writable(
  new Map<number, Room>([
    // [123, {id: "123", name: 'room1(not enter)', roomtype: RoomType.LOCK, memberCount: 4}],
    // [456, {id: "456", name: 'room2(not enter)', roomtype: RoomType.NORMAL, memberCount: 3}],
    // [7777, {id: "7777", name: 'room3(not enter)', roomtype: RoomType.NORMAL, memberCount: 121}],
    // [5454, {id: "5454", name: 'room4(not enter)', roomtype: RoomType.NORMAL, memberCount: 555}],
    // [3212, {id: "3212", name: 'room5(not enter)', roomtype: RoomType.NORMAL, memberCount: 77}],
    // [9797, {id: "9797", name: 'room6(not enter)', roomtype: RoomType.LOCK, memberCount: 787}]
  ])
);

export {
  gameSettingStore,
  modalStatesStore,
  myData,
  openedRoom,
  socketStore,
  roomList,
  myLevel,
};
