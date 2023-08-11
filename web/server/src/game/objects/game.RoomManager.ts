import { Queue } from 'datastructures-js';
import { PlayerInfo } from 'src/types/interfaces';

export class GameRoomManager {
  private GameRoomList = new Set<string>();
  private GameQueue = new Queue<PlayerInfo>();

  newGameRoomKey(): string {
    for (const i in this.GameRoomList) {
      let key: string = 'g' + i;
      if (!this.GameRoomList.has(key)) {
        this.GameRoomList.add(key);
        return key;
      }
    }
  }

  deleteGameRoomKey(key: string) {
    if (this.GameRoomList.has(key)) {
      this.GameRoomList.delete(key);
    }
  }

  enqueue(info: PlayerInfo) {
    this.GameQueue.enqueue(info);
  }

  dequeue(): PlayerInfo {
    return this.GameQueue.dequeue();
  }

  isMatched(): boolean {
    return this.GameQueue.size() > 1;
  }
}
