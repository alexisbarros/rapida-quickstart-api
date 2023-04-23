import {google} from 'googleapis';

export class GetGoogleLoginUrl {

  public async execute(
    clientRedirectUri: string,
    invitationId?: string,
  ): Promise<string>{
    try {

      const clientRedirectUriParam = `clientRedirectUri=${clientRedirectUri}`;
      const invitationIdParam = invitationId && `&invitationId=${invitationId}`;

      const googleOAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.OAUTH_REDIRECT_URI}/auth/google`
      )

      const url = googleOAuth2Client.generateAuthUrl({
        'access_type': "offline",
        'scope':
          [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
          ],
        'state': `${clientRedirectUriParam}${invitationIdParam ?? ''}`
      });

      return url;

    } catch (err) {

      throw new Error(err.message)

    }
  }

}
