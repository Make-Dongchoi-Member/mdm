import { Level, RoomType } from './enums';

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
