export class PendingUser {
  id: number;
  email: string;
  login: string;
  image: string;
  authCode?: string;
  validity?: Date;
}
