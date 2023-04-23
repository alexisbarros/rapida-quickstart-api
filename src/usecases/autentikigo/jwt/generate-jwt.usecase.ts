import jwt from 'jsonwebtoken';
import {IJwtPayload} from '../../../interfaces/jwt.interface';

export class GenerateJWT {

  public execute(payload: IJwtPayload, expiresIn: string): string{
    return jwt.sign(payload, process.env.AUTENTIKIGO_SECRET!, {expiresIn});
  }

}
