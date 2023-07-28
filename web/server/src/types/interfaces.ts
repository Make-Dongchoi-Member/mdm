import { Level } from './enums';

export interface UserData {
  id: number;
  avatar: string;
}

export interface Profile {
  user: UserData;
  level: Level;
  isMuted: boolean;
}

export interface Message {
  sender: UserData;
  body: string;
  isDM: boolean;
  date: Date;
}
