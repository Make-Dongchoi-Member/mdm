import { Queue } from 'datastructures-js';
import { AlertData, GameStatus, Player } from 'src/types/interfaces';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { GameUtil } from './game.util';
import { GAME_LIFE } from 'src/configs/constants';
import { GameRoomDTO } from './dto/GameRoom.dto';

@Injectable()
export class GameStore {
  constructor(private readonly util: GameUtil) {}

  private gameRoomList = new Map<string, NodeJS.Timer>();
  private gameQueue = new Queue<Player>();
  private privateGameWaitList = new Map<string, Player>();
  private gameRoomStatusMap = new Map<string, GameStatus>();

  getStatusMap(): Map<string, GameStatus> {
    return this.gameRoomStatusMap;
  }

  getPrivateGame(roomId: string): Player {
    return this.privateGameWaitList.get(roomId);
  }

  deletePrivateGame(roomId: string): void {
    this.privateGameWaitList.delete(roomId);
  }

  isPrivateGame(roomId: string): boolean {
    return this.privateGameWaitList.has(roomId);
  }

  pushPrivateGame(socket: Socket, alert: AlertData) {
    const player: Player = {
      socket,
      nickname: alert.sender.nickname,
      bar: this.util.barSetter({
        nickname: alert.sender.nickname,
        gameMode: alert.gameSetting.gameMode,
        barColor: alert.gameSetting.barColor,
      }),
      life: GAME_LIFE,
    };
    this.privateGameWaitList.set(alert.roomId, player);
  }

  newGameRoomKey(): string {
    let randomString = this.generateRandomString(8);
    while (this.gameRoomList.has(randomString)) {
      randomString = this.generateRandomString(8);
    }
    this.gameRoomList.set(randomString, undefined);
    return randomString;
  }

  deleteGameRoomKey(key: string) {
    if (this.gameRoomList.has(key)) {
      this.gameRoomList.delete(key);
    }
  }

  saveIntervalID(key: string, id: NodeJS.Timer) {
    this.gameRoomList.set(key, id);
  }

  getIntervalID(key: string): NodeJS.Timer {
    return this.gameRoomList.get(key);
  }

  enqueue(info: Player) {
    this.gameQueue.enqueue(info);
  }

  dequeue(): Player {
    return this.gameQueue.dequeue();
  }

  isMatched(): boolean {
    return this.gameQueue.size() > 1;
  }

  hasQueue(nickname: string): boolean {
    const arr = this.gameQueue.toArray().filter((e) => e.nickname === nickname);
    return arr.length > 0;
  }

  hasQueueBySocketId(socketId: string): boolean {
    const arr = this.gameQueue
      .toArray()
      .filter((e) => e.socket.id === socketId);
    return arr.length > 0;
  }

  getPrivateRoomKeyBySocketId(socketId: string): string | null {
    for (const [key, value] of this.privateGameWaitList) {
      if (value.socket.id === socketId) return key;
    }
    return null;
  }

  getPrivateRoomKeyByNickname(nickname: string): GameRoomDTO | null {
    for (const [key, value] of this.privateGameWaitList) {
      if (value.nickname === nickname)
        return { playerA: nickname, playerB: undefined, roomKey: key };
    }
    for (const [key, value] of this.gameRoomStatusMap) {
      if (value.playerB.nickname === nickname)
        return {
          playerA: value.playerA.nickname,
          playerB: nickname,
          roomKey: key,
        };
    }
    return null;
  }

  deletePlayerAtQueue(nickname: string) {
    const arr = this.gameQueue.toArray().filter((e) => e.nickname !== nickname);
    this.gameQueue = new Queue<Player>(arr);
  }

  deletePlayerAtQueueBySocketId(socketId: string) {
    const arr = this.gameQueue
      .toArray()
      .filter((e) => e.socket.id !== socketId);
    this.gameQueue = new Queue<Player>(arr);
  }

  private generateRandomString(length: number): string {
    const characters = '0123456789';
    const charactersLength = characters.length;
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }
}
