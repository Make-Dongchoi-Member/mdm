import { writable, type Writable } from "svelte/store";
import type {
  MyData,
  GameSetting,
  ModalStates,
  Room,
  RoomDetail,
  RoomList,
  DM,
  UserData,
  OtherUserData,
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
  friends: [],
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

const profileModalStore: Writable<UserData> = writable();

const openedRoom: Writable<RoomDetail> = writable({
  roomId: "",
  hostId: "",
  myLevel: Level.MEMBER,
  roomname: "",
  roomtype: RoomType.NORMAL,
  memberCount: 0,
  members: new Map(),
  history: [],
});

const roomList: Writable<RoomList> = writable(new Map<number, Room>());

const dm: Writable<DM> = writable({
  with: {
    id: "",
    avatar: "",
    nickname: "",
  },
  history: [],
});

export {
  gameSettingStore,
  modalStatesStore,
  myData,
  openedRoom,
  socketStore,
  roomList,
  dm,
  profileModalStore,
};
