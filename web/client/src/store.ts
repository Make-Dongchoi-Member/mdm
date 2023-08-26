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

const apiUrl: string =
  process.env.NODE_ENV == "prod"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_DEV_API_URL;

const socket = io(apiUrl, {
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
  themeColor: "#FF6231",
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
  apiUrl,
};
