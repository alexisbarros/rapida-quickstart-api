import {UserRepository} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, Response, RestBindings, api, post, requestBody, response} from '@loopback/rest';
import {ICompanyRepository, IPersonRepository, IUserRepository} from '../domain/repositories';
import {CompanyRepository, PersonRepository} from '../repositories';
import {GenerateJWT} from '../usecases/jwt';
import {SignupCompany, SignupPerson} from '../usecases/signup';
import {getSwaggerRequestBodySchema} from '../utils/general.util';
import {IHttpResponse, badRequestErrorHttpResponse, createHttpResponse} from '../utils/http-response.util';

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
  ) {}

  @post('signup-person')
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
      ).execute(data.uniqueId, data.birthday, token);

      if(idOfCreatedUser === 'noAuthorized'){
        this.httpResponse.status(401)
        return this.httpResponse.send({ statusCode: 401 });
      }

      const authToken = new GenerateJWT().execute({ id: idOfCreatedUser },'7d');
      this.httpResponse.cookie('auth-token', authToken);

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

  @post('signup-company')
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

      const authToken = new GenerateJWT().execute({ id: idOfCreatedUser },'7d');
      this.httpResponse.cookie('auth-token', authToken);

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
