import {IJwtPayload} from '../../../interfaces';
import {DecodeJwt} from './decode-jwt.usecase';
import {GenerateJWT} from './generate-jwt.usecase';
import {VerifyJwt} from './verify-jwt.usecase';

export class RefreshJwt {

  public execute(token: string): string {
    if(!token) throw new Error('Token must be provided')
    const payload: IJwtPayload = new DecodeJwt().execute(token);

    try{ new VerifyJwt().execute(payload.refreshToken) }
    catch(err) { throw new Error('Refresh token invalid') }

    const {id} = payload;
    const refreshToken = new GenerateJWT().execute({ id }, '30d');
    return new GenerateJWT().execute({ id, refreshToken }, '7d');
  }

}
