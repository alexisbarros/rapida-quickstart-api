import jwt from 'jsonwebtoken';
import {IJwtPayload} from '../../../interfaces/jwt.interface';

export class DecodeJwt {

  public execute(token?: string): IJwtPayload {
    if(!token) throw new Error('Token must be provided')
    const payload = jwt.decode(token.split(' ')[1]);
    return payload as IJwtPayload;
  }

}
