export class UserData {
	id: string;
	avatarSrc: string;
}

export class Message {
	sender: UserData;
	roomId: string;
	body: string;
	isDM: boolean;
	date: string;
}
