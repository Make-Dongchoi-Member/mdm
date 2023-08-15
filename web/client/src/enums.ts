export enum Level {
  HOST = "host",
  ADMIN = "admin",
  MEMBER = "member",
}

export enum RoomType {
  NORMAL = "normal",
  LOCK = "lock",
  PRIVATE = "private",
}

export enum GameState {
  READY,
  GAMING,
  END,
}

export enum Relation {
  FRIEND = "friend",
  BLOCK = "block",
  NONE = "none",
}

export enum UserState {
  ONLINE = "online",
  OFFLINE = "offline",
  GAMING = "gaming",
}
