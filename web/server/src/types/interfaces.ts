import { GameState, Level, RoomType } from './enums';

export interface UserData {
  id: number;
  avatar: string;
  nickname: string;
}

export interface MyData extends UserData {
  rooms: number[];
}

export interface Profile {
  user: UserData;
  level: Level;
  isMuted: boolean;
}

export interface Message {
  sender: UserData;
  roomId: string;
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
  speedX : number;
  speedY : number;
}

export interface Bar {
  y: number;
}

export interface GameStatus {
  ball: Ball,
  barA : Bar,
  barB : Bar,
  state : GameState,
}
