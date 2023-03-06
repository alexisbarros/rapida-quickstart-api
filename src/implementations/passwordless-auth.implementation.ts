import {sign} from 'jsonwebtoken';
import {SendMessage} from '.';
import {IPasswordlessAuth} from '../interfaces/auth.interface';

export interface IPasswordlessBody {
  phoneNumber: string;
}

export class PasswordlessAuthImplementation implements IPasswordlessAuth {
  async sendVerificationCode(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<string> {
    const message = await SendMessage.sendSms({
      number: phoneNumber,
      body: `Verification code: ${verificationCode}`
    });

    if(message){
      return this.createAuthToken(phoneNumber, verificationCode);
    } else {
      throw new Error('Verification code not sent');
    }
  }

  createAuthToken(phoneNumber: string, verificationCode: string): string {

    return sign(
      { phoneNumber, verificationCode},
      process.env.AUTENTIKIGO_SECRET!, {
      expiresIn: '5m'
    })

  }

}
