import type { Level, RoomType } from "./enums";

export interface UserData {
	id: string;
	avatarSrc: string;
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

export interface RoomDetail extends Room {
	members: Map<string, Profile>;
	history: Message[];
}

export interface RoomInfoDTO {
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
	isProfileSocialModal: boolean;
	isProfileHistoryModal: boolean;
}

export interface MyData extends UserData {
	rooms: Room[];
}

export interface SetRequestDTO {
	roomId: string;
	userId: string;
	targetId: string;
}

