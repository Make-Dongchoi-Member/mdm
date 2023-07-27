import { RoomType } from 'src/types/enums';
import { Message, Profile } from 'src/types/interfaces';

export class roomDetail {
  id: string;
  name: string;
  roomtype: RoomType;
  memberCount: number;
  members: string;
  history: Message[];
}
