import {UserRepository} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  Request,
  Response,
  RestBindings,
  api, get, param, post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  ICompanyRepository,
  IInvitationRepository,
  IPermissionRepository,
  IPersonRepository,
  IUserRepository,
} from '../../domain/repositories';
import {CompanyRepository, InvitationRepository, PermissionRepository, PersonRepository} from '../../repositories';
import {GetAppleLoginUrl} from '../../usecases/autentikigo/apple';
import {GetGoogleLoginUrl} from '../../usecases/autentikigo/google';
import {GenerateJWT} from '../../usecases/autentikigo/jwt';
import {SignupCompany, SignupPerson} from '../../usecases/autentikigo/signup';
import {getSwaggerRequestBodySchema} from '../../utils/general.util';
import {
  IHttpResponse,
  badRequestErrorHttpResponse,
  createHttpResponse,
} from '../../utils/http-response.util';

const signupSchema = {
  uniqueId: { type: 'string', required: true },
  birthday: { type: 'number', required: true },
}

interface ISignup {
  uniqueId: string,
  birthday: number,
}

@api({basePath: 'auth'})
export class AuthController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(UserRepository) private userRepository: IUserRepository,
    @repository(PersonRepository) private personRepository: IPersonRepository,
    @repository(CompanyRepository) private companyRepository: ICompanyRepository,
    @repository(InvitationRepository) private invitationRepository: IInvitationRepository,
    @repository(PermissionRepository) private permissionRepository: IPermissionRepository,
  ) {}

  @get('login/google')
  @response(204)
  async googleLogin(
    @param.query.string('invitation-id') invitationId?: string,
  ): Promise<IHttpResponse | void>{
    try {
      const googleLoginUrl = await new GetGoogleLoginUrl().execute(
        process.env.CLIENT_URI!,
        invitationId,
      );

      this.httpResponse.redirect(googleLoginUrl);
    } catch (err) {
      return badRequestErrorHttpResponse({
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }
  }

  @get('login/apple')
  @response(204)
  async appleLogin(
    @param.query.string('invitation-id') invitationId?: string,
  ): Promise<IHttpResponse | void>{
    try {
      const appleLoginUrl = await new GetAppleLoginUrl().execute(
        process.env.CLIENT_URI!,
        invitationId,
      );

      this.httpResponse.redirect(appleLoginUrl);
    } catch (err) {
      return badRequestErrorHttpResponse({
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }
  }

  @post('signup/person')
  @response(201)
  async signupPerson(
    @requestBody(getSwaggerRequestBodySchema(signupSchema, []))
    data: ISignup
  ): Promise<IHttpResponse>{
    try{
      const token = this.httpRequest.headers.authorization;

      const idOfCreatedUser = await new SignupPerson(
        this.personRepository,
        this.userRepository,
        this.invitationRepository,
        this.permissionRepository,
      ).execute(data.uniqueId, data.birthday, token);

      if(idOfCreatedUser === 'noAuthorized'){
        this.httpResponse.status(401)
        return this.httpResponse.send({ statusCode: 401 });
      }

      const refreshToken = new GenerateJWT()
        .execute({ id: idOfCreatedUser }, '30d');

      const authToken = new GenerateJWT().execute(
        { id: idOfCreatedUser, refreshToken },
        '7d',
      );
      this.httpResponse.cookie('auth-token', authToken, { expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) });

      return createHttpResponse({
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch (err) {
      return badRequestErrorHttpResponse({
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }
  }

  @post('signup/company')
  @response(201)
  async signupCompany(
    @requestBody(getSwaggerRequestBodySchema(signupSchema, []))
    data: ISignup
  ): Promise<IHttpResponse>{
    try{
      const token = this.httpRequest.headers.authorization;

      const idOfCreatedUser = await new SignupCompany(
        this.companyRepository,
        this.userRepository,
      ).execute(data.uniqueId, data.birthday, token);

      if(idOfCreatedUser === 'noAuthorized'){
        this.httpResponse.status(401)
        return this.httpResponse.send({ statusCode: 401 });
      }

      const refreshToken = new GenerateJWT()
        .execute({ id: idOfCreatedUser }, '30d');

      const authToken = new GenerateJWT().execute(
        { id: idOfCreatedUser, refreshToken },
        '7d',
      );
      this.httpResponse.cookie('auth-token', authToken, { expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) });

      return createHttpResponse({
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch (err) {
      return badRequestErrorHttpResponse({
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }
  }
}
