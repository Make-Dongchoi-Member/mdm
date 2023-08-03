import type { Level, RoomType } from "./enums";

export interface UserData {
	id: string;
	avatar: string;
	nickname: string;
}

export interface Notification {
	sender: string;
	body: string;
}

export interface RequestNoti extends Notification {
	pageUrl: string;
}

export interface Message {
	sender: UserData;
	roomId: string;
	body: string;
	isDM: boolean;
	date: string;
}

export interface Profile {
	user: UserData;
	level: Level;
	isMuted: boolean;
}

export interface Room {
	id: string;
	name: string;
	roomtype: RoomType;
	memberCount: number;
}

export type RoomList = Map<number, Room>;

export interface RoomDetail extends Room {
	members: Map<string, Profile>;
	history: Message[];
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
	ballShape: string;
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
}

export interface MyData extends UserData {
	rooms: number[];
	// rooms: Room[];
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
