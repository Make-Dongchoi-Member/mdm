import { Queue } from 'datastructures-js';
import { Player } from 'src/types/interfaces';
import { Socket } from 'socket.io';

export class GameRoomManager {
  private GameRoomList = new Map<string, NodeJS.Timer>();
  private GameQueue = new Queue<Player>();

  newGameRoomKey(): string {
    let randomString = this.generateRandomString(8);
    while (this.GameRoomList.has(randomString)) {
      randomString = this.generateRandomString(8);
    }
    this.GameRoomList.set(randomString, undefined);
    return randomString;
    // for (let i in this.GameRoomList) {
    //   const key: string = 'g' + i;
    //   console.log(key);
    //   if (!this.GameRoomList.has(key)) {
    //     this.GameRoomList.set(key, undefined);
    //     return key;
    //   }
    // }
  }

  deleteGameRoomKey(key: string) {
    if (this.GameRoomList.has(key)) {
      this.GameRoomList.delete(key);
    }
  }

  saveIntervalID(key: string, id: NodeJS.Timer) {
    this.GameRoomList.set(key, id);
  }

  getIntervalID(key: string): NodeJS.Timer {
    return this.GameRoomList.get(key);
  }

  enqueue(info: Player) {
    this.GameQueue.enqueue(info);
  }

  dequeue(): Player {
    return this.GameQueue.dequeue();
  }

  isMatched(): boolean {
    return this.GameQueue.size() > 1;
  }

  hasQueue(nickname: string): boolean {
    const arr = this.GameQueue.toArray().filter((e) => e.nickname === nickname);
    return arr.length > 0;
  }

  hasQueueBySocketId(socketId: string): boolean {
    const arr = this.GameQueue.toArray().filter(
      (e) => e.socket.id === socketId,
    );
    return arr.length > 0;
  }

  deletePlayerAtQueue(nickname: string) {
    const arr = this.GameQueue.toArray().filter((e) => e.nickname !== nickname);
    this.GameQueue = new Queue<Player>(arr);
  }

  deletePlayerAtQueueBySocketId(socketId: string) {
    const arr = this.GameQueue.toArray().filter(
      (e) => e.socket.id !== socketId,
    );
    this.GameQueue = new Queue<Player>(arr);
  }

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }
}
