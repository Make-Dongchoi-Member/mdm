import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PendingUser } from './objects/pending-user.object';
import { PendingUserService } from './objects/pending-user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import {
  API_URL,
  AUTHORIZE_PATH,
  CLIENT_ID,
  CLIENT_SECRET,
  JWT_SECRET,
  OAUTH42_BASE_URL,
  OAUTH_TOKEN_PATH,
  USER_INFO_PATH,
} from 'src/configs/constants';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class LoginService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly pendingUsers: PendingUserService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async oAuth42AccessUrl() {
    const baseUrl = this.config.get(OAUTH42_BASE_URL);
    const path = this.config.get(AUTHORIZE_PATH);
    const queryParams = {
      client_id: this.config.get(CLIENT_ID),
      redirect_uri: `${this.config.get(API_URL)}/api/login/oauth42`,
      response_type: 'code',
    };
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const url = `${baseUrl + path}?${queryString}`;
    return url;
  }

  async tokenValidCheck(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get(JWT_SECRET),
      });
      await this.userRepository.findOneByOrFail({ id: +payload.sub });
    } catch (e) {
      return false;
    }
    return true;
  }

  async generatePendingUser(code: string) {
    const accessToken = await this.requestToken(code);
    const newUser = await this.newPendingUser(accessToken);
    this.pendingUsers.save(newUser);
    this.sendMail(newUser.id);
    return { id: newUser.id, email: newUser.email };
  }

  async verifyEmailCode(userId: number, emailCode: string) {
    const user = this.pendingUsers.verify(userId, emailCode);
    const access_token = await this.generateJwtToken(user);
    await this.userRepository.saveNewUser(user);
    return access_token;
  }

  private async generateJwtToken(user: PendingUser) {
    const payload = { sub: user.id };
    return this.jwtService.signAsync(payload);
  }

  private async requestToken(code: string): Promise<string> {
    const baseUrl = this.config.get(OAUTH42_BASE_URL);
    const oauthTokenUrl = baseUrl + this.config.get(OAUTH_TOKEN_PATH);
    const data = {
      grant_type: 'authorization_code',
      client_id: this.config.get(CLIENT_ID),
      client_secret: this.config.get(CLIENT_SECRET),
      code: code,
      redirect_uri: `${this.config.get(API_URL)}/api/login/oauth42`,
    };
    const response = await firstValueFrom(
      this.httpService.post(oauthTokenUrl, data),
    );
    return response.data.access_token;
  }

  private async newPendingUser(token: string): Promise<PendingUser> {
    const baseUrl = this.config.get(OAUTH42_BASE_URL);
    const userInfoApiUrl = baseUrl + this.config.get(USER_INFO_PATH);
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const userInfo = await firstValueFrom(
      this.httpService.get(userInfoApiUrl, { headers }),
    );
    const pendingUser = {
      id: userInfo.data.id,
      email: userInfo.data.email,
      login: userInfo.data.login,
      image: userInfo.data.image.link,
    } as PendingUser;
    return pendingUser;
  }

  private async sendMail(id: number) {
    const user = this.pendingUsers.search(id);
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'MDM 이메일 인증 코드',
        template: 'auth',
        context: {
          verificationCode: user.authCode,
        },
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
