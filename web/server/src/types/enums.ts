export enum Level {
  HOST = 'host',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum RoomType {
  NORMAL = 'normal',
  LOCK = 'lock',
  PRIVATE = 'private',
}

export enum GameState {
  READY,
  GAMING,
  PAUSE,
  END,
}
