import AppleSignIn, {AppleSignInOptions} from 'apple-sign-in-rest'
import {IAppleAuthorizationUrlConfig, IOAuthUser} from '../../../interfaces/auth.interface'

export class GetAppleUserInfoFromCode {

  private appleSignIn: AppleSignIn
  private options: AppleSignInOptions
  private expirationAuthToken: number

  constructor(){
    this.options = {
      clientId: process.env.APPLE_CLIENT_ID as string,
      teamId: process.env.APPLE_TEAM_ID as string,
      keyIdentifier: process.env.APPLE_KEY_IDENTIFIER as string,
      privateKeyPath: process.env.APPLE_KEY_PATH as string,
      // privateKey: process.env.APPLE_KEY
    }
    this.appleSignIn = new AppleSignIn(this.options)
    this.expirationAuthToken = parseInt(process.env.APPLE_EXPIRATION_AUTH_TOKEN_IN_SECONDS as string) || 300

  }

  public async execute(token: string): Promise<IOAuthUser> {
    try {

      const config: IAppleAuthorizationUrlConfig = {
        redirectUri: `${process.env.OAUTH_REDIRECT_URI}/auth/apple`,
        scope: ['name', 'email']
      }

      const clientSecret = this.appleSignIn.createClientSecret({expirationDuration: this.expirationAuthToken})

      const accessToken = await this.appleSignIn.getAuthorizationToken(clientSecret, token!, {
        redirectUri: process.env.APPLE_AUTH_REDIRECT_URI
      });

      const {email, sub} = await this.appleSignIn.verifyIdToken(
        accessToken.id_token,
        {nonce: config.nonce},
      );

      if(!email) throw new Error('Apple user not found');

      const appleUser: IOAuthUser = {
        email,
        appleId: sub
      };

      return appleUser;

    } catch (err) {

      throw new Error(err.message)

    }
  }

}
