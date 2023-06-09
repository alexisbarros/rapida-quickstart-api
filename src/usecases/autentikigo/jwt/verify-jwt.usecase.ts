import jwt from 'jsonwebtoken';
import {IJwtPayload} from '../../../interfaces/jwt.interface';

export class VerifyJwt {

  public execute(token?: string): IJwtPayload {
    if(!token) throw new Error('Token must be provided')
    const payload = jwt.verify(token.split(' ')[1], process.env.AUTENTIKIGO_SECRET!);
    return payload as IJwtPayload;
  }

}
