export class PendingUser {
  id: number;
  email: string;
  login: string;
  authCode?: string;
  validity?: Date;
  // 이미지?,
}
