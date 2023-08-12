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

export enum Relation {
  FRIEND = 'friend',
  BLOCK = 'block',
  NONE = 'none',
}
