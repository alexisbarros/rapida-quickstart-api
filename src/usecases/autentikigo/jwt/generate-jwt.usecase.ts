import jwt from 'jsonwebtoken';
import {IJwtPayload} from '../../../interfaces/jwt.interface';

export class GenerateJWT {

  public execute(payload: IJwtPayload, expiresIn: string): string{
    const token = jwt.sign(payload, process.env.AUTENTIKIGO_SECRET!, {expiresIn});
    return `Bearer ${token}`;
  }

}
