import { Message, UserData } from 'src/types/interfaces';

export class DMHistoryDTO {
  id: number;
  with: UserData;
  history: Message[];
}
