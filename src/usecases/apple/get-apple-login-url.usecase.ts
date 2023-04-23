import {generateUniqueId} from '@loopback/core';
import AppleSignIn, {AppleSignInOptions} from 'apple-sign-in-rest';
import {IAppleAuthorizationUrlConfig} from '../../interfaces/auth.interface';

export class GetAppleLoginUrl {

  private appleSignIn: AppleSignIn
  private options: AppleSignInOptions

  constructor(){
    this.options = {
      clientId: process.env.APPLE_CLIENT_ID as string,
      teamId: process.env.APPLE_TEAM_ID as string,
      keyIdentifier: process.env.APPLE_KEY_IDENTIFIER as string,
      privateKeyPath: process.env.APPLE_KEY_PATH as string,
      // privateKey: process.env.APPLE_KEY
    }
    this.appleSignIn = new AppleSignIn(this.options)
  }

  public async execute(
    clientRedirectUri: string,
    invitationId?: string,
  ): Promise<string>{
    try {

      const clientRedirectUriParam = `clientRedirectUri=${clientRedirectUri}`;
      const invitationIdParam = invitationId && `&invitationId=${invitationId}`;

      const config: IAppleAuthorizationUrlConfig = {
        redirectUri: `${process.env.OAUTH_REDIRECT_URI}/auth/apple`,
        scope: ['name', 'email'],
        state: `${clientRedirectUriParam}${invitationIdParam ?? ''}`,
        response_mode: 'query'
      }

      config.nonce = !config.nonce ? generateUniqueId() : config.nonce;

      return this.appleSignIn.getAuthorizationUrl(config);

    } catch (err) {

      throw new Error(err.message)

    }
  }

}
