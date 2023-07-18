import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async oAuth42AccessUrl() {
    const baseUrl = this.config.get('42OAUTH_BASE_URL');
    const path = this.config.get('AUTHORIZE_PATH');
    const queryParams = {
      client_id: this.config.get('CLIENT_ID'),
      redirect_uri: `${this.config.get('APP_URL')}/login/oauth42`,
      response_type: 'code',
    };
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const url = `${baseUrl + path}?${queryString}`;
    return url;
  }
}
