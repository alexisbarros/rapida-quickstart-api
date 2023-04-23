import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {OperationVisibility, Request, Response, RestBindings, api, get, param, response, visibility} from '@loopback/rest';
import {IUserRepository} from '../domain/repositories';
import {UserRepository} from '../repositories';
import {GetAppleLoginUrl, GetAppleUserInfoFromCode} from '../usecases/apple';
import {GenerateJWT} from '../usecases/jwt';
import {GetUserByEmail} from '../usecases/user';
import {IHttpResponse, badRequestErrorHttpResponse} from '../utils/http-response.util';

@api({basePath: 'apple'})
export class AppleController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(UserRepository) private userRepository: IUserRepository,
  ) {}

  @get('login')
  @response(204)
  async login(
    @param.query.string('redirect-uri', { required: true }) redirectUri: string,
    @param.query.string('invitation-id') invitationId?: string,
  ): Promise<IHttpResponse | void>{
    try {
      const appleLoginUrl = await new GetAppleLoginUrl().execute(redirectUri, invitationId);

      this.httpResponse.redirect(appleLoginUrl);
    } catch (err) {
      return badRequestErrorHttpResponse({
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }
  }

  @visibility(OperationVisibility.UNDOCUMENTED)
  @get('')
  @response(204)
  async handleUserData(
    @param.query.string('code') code: string,
    @param.query.string('state') state?: string,
  ): Promise<IHttpResponse | void>{
    try{
      const clientRedirectUri = new URLSearchParams(state).get('clientRedirectUri');
      // const invitationId = new URLSearchParams(state).get('invitationId');

      const oAuthUser = await new GetAppleUserInfoFromCode().execute(code);
      const user = await new GetUserByEmail(this.userRepository)
        .execute(oAuthUser.email);

      const token = new GenerateJWT().execute(
        user ? { id: user._id! } : {...oAuthUser},
        user ? '7d' : '1d'
      );

      if(user) {
        this.httpResponse.cookie('auth-token', token);
        this.httpResponse.redirect(`${clientRedirectUri!}/home`);
      } else {
        this.httpResponse.cookie('signup-token', token);
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
