import jwt from 'jsonwebtoken';
import {IJwtPayload} from '../../interfaces/jwt.interface';

export class VerifyJwt {

  public execute(token: string): IJwtPayload {
    const payload = jwt.verify(token, process.env.AUTENTIKIGO_SECRET!);
    return payload as IJwtPayload;
  }

}
