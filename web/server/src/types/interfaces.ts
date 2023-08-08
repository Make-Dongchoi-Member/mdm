import { Level, Relation, RoomType } from './enums';

export interface UserData {
  avatar: string;
  nickname: string;
  record?: Record[];
}

export interface MyData extends UserData {
  id: number;
  rooms: number[];
  friends: FriendData[];
}

export interface OtherUserData extends UserData {
  relation: Relation;
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
  id: string;
  name: string;
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
  nickname: string;
  avatar: string;
}

export interface Record {
  enemy: string;
  win: boolean;
  date: Date;
}
