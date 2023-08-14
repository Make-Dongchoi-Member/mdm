import { GameState, Relation, Level, RoomType, UserState } from './enums';
import { Socket } from 'socket.io';

export interface UserData {
  id?: number;
  avatar: string;
  nickname: string;
  record?: Record[];
}

export interface MyData extends UserData {
  rooms: number[];
  friends: FriendData[];
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

export interface FriendData {
  id: number;
  nickname: string;
  avatar: string;
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
}

export interface Player {
  bar: Bar;
  life: number;
  nickname: string;
}

export interface GameStatus {
  ball: Ball;
  state: GameState;
  playerA: Player;
  playerB: Player;
}

export interface PlayerInfo {
  socket: Socket;
  nickname: string;
}
