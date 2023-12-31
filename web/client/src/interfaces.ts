import type {
  AlertType,
  GameState,
  Level,
  Relation,
  RoomType,
  UserState,
} from "./enums";

export interface UserData {
  id: string;
  avatar?: string;
  nickname: string;
  record?: Record[];
  state?: UserState;
}

export interface Record {
  enemy: string;
  win: boolean;
  date: Date;
}

export interface Notification {
  sender: string;
  body: string;
}

export interface RequestNoti extends Notification {
  pageUrl: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Rect {
  w: number;
  h: number;
  x: number;
  y: number;
  color: string;
}

export interface Ball extends Rect {
  speedX: number;
  speedY: number;
}

export interface Bar extends Rect {
  speed: number;
}

export interface SocketBall {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
}

export interface SocketBar {
  y: number;
  h: number;
  color: string;
}

export interface Player {
  bar: SocketBar;
  life: number;
  nickname: string;
}

export interface GameStatus {
  ball: SocketBall;
  state: GameState;
  playerA: Player;
  playerB: Player;
}

export interface GameRoom {
  playerA: string;
  playerB: string;
  roomKey: string;
}

export interface Message {
  sender: UserData;
  receiver?: string;
  roomId?: string;
  body: string;
  isDM: boolean;
  date: Date;
}

export interface Profile {
  user: UserData;
  level: Level;
  isMuted: boolean;
}

export interface Room {
  roomId: string;
  hostId: string;
  roomname: string;
  memberCount: number;
  roomtype: RoomType;
}

export type RoomList = Map<number, Room>;

export interface RoomDetail extends Room {
  members: Map<string, Profile>;
  banList: number[];
  history: Message[];
  myLevel: Level;
}

export interface RoomInfoDTO {
  roomId: string;
  hostId: string;
  roomname: string;
  password: string;
  roomtype: RoomType;
}

export interface GameSetting {
  gameMode: string;
  barColor: string;
  themeColor: string;
}

export interface ModalStates {
  isNotiModal: boolean;
  isInviteModal: boolean;
  isSettingModal: boolean;
  isRoomoutModal: boolean;
  isRoomCreateModal: boolean;
  isProfileModal: boolean;
  isPasswordInputModal: boolean;
  isLogoutModal: boolean;
  isNicknameModal: boolean;
  isFindModal: boolean;
}

export interface MyData extends UserData {
  rooms: number[];
  friends: UserData[];
  isAlert: boolean;
  twoFactorAuth: boolean;
  isInGame: boolean;
}

export interface SetRequestDTO {
  roomId: string;
  userId: string;
  targetId: string;
}

export interface RoomEnterDTO {
  roomId: string;
  userId: string;
  password: string;
}

export interface PostCreateDTO {
  roomId: string;
}

export interface DMHistory {
  id: string;
  with: UserData;
  history: Message[];
}

export interface OtherUserData extends UserData {
  relation: Relation;
  state?: UserState;
}

export interface DirectMessageDTO {
  message: Message;
}

export interface AlertData {
  alertId?: number;
  alertType: AlertType;
  sender: UserData;
  receiver: UserData;
  roomId?: string;
  gameSetting?: GameSetting;
  date?: Date;
}

export interface AlertListDTO {
  alerts: AlertData[];
}

export interface AlertDTO {
  alert: AlertData;
}
