import { writable, type Writable } from "svelte/store";
import type {
  MyData,
  GameSetting,
  ModalStates,
  Room,
  RoomDetail,
  RoomList,
  DMHistory,
  UserData,
  OtherUserData,
} from "./interfaces";
import { Level, RoomType, UserState } from "./enums";
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
  record: [],
  isAlert: false,
  isInGame: false,
});

const gameSettingStore: Writable<GameSetting> = writable({
  gameMode: "basic",
  barColor: "#D2D2D2",
  ballColor: "#D2D2D2",
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
  isFindModal: false,
});

const profileModalStore: Writable<UserData> = writable({
  id: "",
  avatar: "",
  nickname: "",
});

const openedRoom: Writable<RoomDetail> = writable({
  roomId: "",
  hostId: "",
  myLevel: Level.MEMBER,
  roomname: "",
  roomtype: RoomType.NORMAL,
  memberCount: 0,
  members: new Map(),
  banList: [],
  history: [],
});

const roomList: Writable<RoomList> = writable(new Map<number, Room>());

const dm: Writable<DMHistory> = writable({
  id: "",
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
