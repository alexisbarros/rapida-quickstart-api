import {google} from 'googleapis'
import {IOAuthUser} from '../../interfaces/auth.interface'

export class GetGoogleUserInfoFromCode {

  public async execute(token: string): Promise<IOAuthUser> {
    try {

      const googleOAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.OAUTH_REDIRECT_URI}/auth/google`
      )

      const {tokens} = await googleOAuth2Client.getToken(token)

      googleOAuth2Client.setCredentials(tokens)

      const oauth2 = google.oauth2({version: 'v2', auth: googleOAuth2Client})

      const googleUser = await oauth2.userinfo.v2.me.get()

      if(!googleUser.data) throw new Error('Google user not found');

      return {email: googleUser.data.email!, googleId: googleUser.data.id!}

    } catch (err) {

      throw new Error(err.message)

    }
  }

}
