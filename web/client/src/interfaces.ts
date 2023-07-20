import type { Level } from "./enums";

export interface Message {
	sender: string;
	avatarSrc: string;
	body: string;
	isDM: boolean;
	date: string;
}

export interface Profile {
	id: string;
	avatarSrc: string;
	level: Level;
}

export interface Room {
	id: string;
	name: string;
	isLocked: boolean;
	memberCount: number;
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
}

export interface UserData {
	id: string;
	avatarSrc: string;
}

export interface MyData extends UserData {
	rooms: Room[];
}
