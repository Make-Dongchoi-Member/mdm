import { RoomType } from 'src/types/enums';

export class RoomInfoDto {
  roomId: string;
  hostId: string;
  roomname: string;
  password: string;
  roomtype: RoomType;
}
