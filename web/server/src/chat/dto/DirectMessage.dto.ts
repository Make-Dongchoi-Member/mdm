import { Message, UserData } from 'src/types/interfaces';

export class DirectMessaageDTO {
  id: number;
  with: UserData;
  history: Message[];
}
