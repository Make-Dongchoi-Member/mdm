import {
  GameState,
  Relation,
  Level,
  RoomType,
  UserState,
  AlertType as AlertType,
} from './enums';
import { Socket } from 'socket.io';

export interface UserData {
  id?: number;
  avatar: string;
  nickname: string;
  record?: Record[];
  state?: UserState;
}

export interface MyData extends UserData {
  rooms: number[];
  friends: UserData[];
  isAlert: boolean;
}

export interface OtherUserData extends UserData {
  relation: Relation;
  state?: UserState;
}

export interface Profile {
  user: UserData;
  level: Level;
  isMuted: boolean;
}

export interface Message {
  sender: UserData;
  receiver?: string;
  roomId?: string;
  body: string;
  isDM: boolean;
  date: Date;
}

export interface RoomDetail {
  roomId: string;
  hostId: string;
  roomname: string;
  roomtype: RoomType;
  memberCount: number;
  members: string;
  history: Message[];
}

export interface RoomInfo {
  roomId: string;
  hostId: string;
  roomname: string;
  password: string;
  roomtype: RoomType;
}

export interface Record {
  enemy: string;
  win: boolean;
  date: Date;
}

export interface RoomListInfo {
  roomId: string;
  hostId: string;
  roomname: string;
  memberCount: number;
  roomtype: RoomType;
}

export interface Ball {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
}

export interface Bar {
  y: number;
  h: number;
  color: string;
}

export interface PlayerInfo {
  bar: Bar;
  life: number;
  nickname: string;
}

export interface Player extends PlayerInfo {
  socket: Socket;
}

export interface GameStatus {
  ball: Ball;
  playerA: Player;
  playerB: Player;
  state: GameState;
}

export interface AlertData {
  alertId?: number;
  alertType: AlertType;
  sender: UserData;
  receiver: UserData;
  roomId?: string;
  date?: Date;
}
