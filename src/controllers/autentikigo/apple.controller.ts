import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  OperationVisibility,
  Request, Response,
  RestBindings,
  api, get, param,
  response,
  visibility,
} from '@loopback/rest';
import {IUserRepository} from '../../domain/repositories';
import {UserRepository} from '../../repositories';
import {GetAppleUserInfoFromCode} from '../../usecases/autentikigo/apple';
import {GenerateJWT} from '../../usecases/autentikigo/jwt';
import {GetUserByEmail} from '../../usecases/autentikigo/user';
import {
  IHttpResponse,
  badRequestErrorHttpResponse,
} from '../../utils/http-response.util';

@api({basePath: 'auth'})
export class AppleController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(UserRepository) private userRepository: IUserRepository,
  ) {}

  @visibility(OperationVisibility.UNDOCUMENTED)
  @get('apple')
  @response(204)
  async handleUserData(
    @param.query.string('code') code: string,
    @param.query.string('state') state?: string,
  ): Promise<IHttpResponse | void>{
    try{
      const clientRedirectUri = new URLSearchParams(state)
        .get('clientRedirectUri');

      const invitationId = new URLSearchParams(state)
        .get('invitationId');

      const oAuthUser = await new GetAppleUserInfoFromCode().execute(code);
      const user = await new GetUserByEmail(this.userRepository)
        .execute(oAuthUser.email);

      const refreshToken = user ?
        new GenerateJWT().execute({ id: user._id! }, '30d'): '';

      const token = new GenerateJWT().execute(
        user ? { id: user._id!, refreshToken } : {...oAuthUser, ...(invitationId ? {invitationId} : {})},
        user ? '7d' : '1d'
      );

      if(user) {
        this.httpResponse.cookie('auth-token', token, { expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) });
        this.httpResponse.redirect(`${clientRedirectUri!}/home`);
      } else {
        this.httpResponse.cookie('signup-token', token), { expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) };
        this.httpResponse.redirect(`${clientRedirectUri!}/signu-up`);
      }

    } catch (err) {
      return badRequestErrorHttpResponse({
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }

  }
}
