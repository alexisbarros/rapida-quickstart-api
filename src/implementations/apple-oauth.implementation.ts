import {generateUniqueId} from '@loopback/context';
import AppleSignIn, {AppleSignInOptions} from 'apple-sign-in-rest';
import {sign} from 'jsonwebtoken';
import {IOAuthLogin} from '../interfaces/auth.interface';
import {IOAuthUser} from '../interfaces/user.interface';

interface IAppleAuthorizationUrlConfig {
  redirectUri: string;
  scope?: ('email' | 'name')[];
  state?: string;
  nonce?: string;
}

export class AppleOAuthImplementation implements IOAuthLogin {

  private appleSignIn: AppleSignIn
  private options: AppleSignInOptions
  private expirationAuthToken: number

  constructor() {
    this.options = {
      clientId: process.env.APPLE_CLIENT_ID as string,
      teamId: process.env.APPLE_TEAM_ID as string,
      keyIdentifier: process.env.APPLE_KEY_IDENTIFIER as string,
      privateKeyPath: process.env.APPLE_KEY_PATH as string
    }
    this.appleSignIn = new AppleSignIn(this.options)
    this.expirationAuthToken = parseInt(process.env.APPLE_EXPIRATION_AUTH_TOKEN_IN_SECONDS as string) || 300
  }


  async getOAuthLoginPageUrl(params?: string): Promise<string> {
    try {
      const config: IAppleAuthorizationUrlConfig = {
        redirectUri: `${process.env.OAUTH_REDIRECT_URI}/auth/apple`,
        scope: ['name', 'email'],
        state: params,
      }

      config.nonce = !config.nonce ? generateUniqueId() : config.nonce;

      return this.appleSignIn.getAuthorizationUrl(config);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getOAuthUser(code?: string): Promise<IOAuthUser> {
    try {
      const config: IAppleAuthorizationUrlConfig = {
        redirectUri: `${process.env.OAUTH_REDIRECT_URI}/auth/apple`,
        scope: ['name', 'email']
      }

      const clientSecret = this.appleSignIn.createClientSecret({expirationDuration: this.expirationAuthToken})

      const accessToken = await this.appleSignIn.getAuthorizationToken(clientSecret, code!, {
        redirectUri: process.env.APPLE_AUTH_REDIRECT_URI
      });

      const {email, sub} = await this.appleSignIn.verifyIdToken(
        accessToken.id_token,
        {nonce: config.nonce},
      );

      const appleUser: IOAuthUser = {
        email,
        id: sub
      };

      return appleUser;

    } catch (err) {

      throw new Error(err.message)

    }
  }

  createOAuthToken(oAuthUser: IOAuthUser, invitationId?: string | null): string {

    return sign({
      email: oAuthUser.email, appleId: oAuthUser.id, invitationId
    },
      process.env.AUTENTIKIGO_SECRET!, {
      expiresIn: '5m'
    })

  }

}
