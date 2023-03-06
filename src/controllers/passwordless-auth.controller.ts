import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get, param,
  post,
  Request, requestBody, response, Response,
  RestBindings
} from '@loopback/rest';
import {LocaleEnum} from '../enums/locale.enum';
import {HttpResponseToClient, JwtToken} from '../implementations/index';
import {IPasswordlessBody, PasswordlessAuthImplementation} from '../implementations/passwordless-auth.implementation';
import {ProfileFromAPIImplementation} from '../implementations/profile-from-api.implementation';
import {IGetProfile, IPasswordlessAuth} from '../interfaces/auth.interface';
import {IHttpResponse} from '../interfaces/http.interface';
import {CompanyRepository} from '../repositories/company.repository';
import {PersonRepository} from '../repositories/person.repository';
import {AuthService} from '../services';
import {serverMessages} from '../utils/server-messages';

export class PasswordlessAuthController {

  private passwordlessAuth: IPasswordlessAuth
  private getProfile: IGetProfile

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @service(AuthService) private authService: AuthService,

    @repository(PersonRepository) private personRepository: PersonRepository,
    @repository(CompanyRepository) private companyRepository: CompanyRepository,
  ) {
    this.passwordlessAuth = new PasswordlessAuthImplementation()
    this.getProfile = new ProfileFromAPIImplementation()
  }

  @post('auth/passwordless/send-verification')
  async sendPasswordlessVerificationCode(
    @requestBody({
      content: {
        'application/json': {},
      },
    }) data: IPasswordlessBody,
  ): Promise<IHttpResponse> {
    try {

      const token = this.authService.createPasswordlessToken();

      const authToken = await this.authService.sendPasswordlessToken(
        this.passwordlessAuth,
        data.phoneNumber,
        token,
      );

      return HttpResponseToClient.okHttpResponse({
        message: 'Token sent',
        logMessage: 'Token sent',
        data: authToken,
        request: this.httpRequest,
        response: this.httpResponse,
      })

    } catch (err) {

      return HttpResponseToClient.badRequestErrorHttpResponse({
        message: err.messsage,
        logMessage: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      })

    }
  }

  @get('auth/passwordless/signup')
  @response(200, {
    description: 'User has authorization',
    properties: {
      message: {type: 'string'},
      statusCode: {type: 'number'},
      data: {
        properties: {
          authToken: {type: 'string'},
          token: {type: 'string'},
          userData: {
            properties: {
              _id: {type: 'string'},
              phoneNumber: {type: 'string'},
            }
          }
        }
      }
    }
  })
  async passwordlessSignup(
    @param.query.string('phone-number') phoneNumber: string,
    @param.query.string('verification-code') verificationCode: string,
  ): Promise<IHttpResponse> {
    try {

      const tokenVerified = JwtToken.verifyAuthToken(
        this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
        this.httpRequest, this.httpResponse
      )
      if (!tokenVerified) throw serverMessages['httpResponse']['unauthorizedError'][LocaleEnum['pt-BR']]

      const loginUserInfo = JwtToken.getLoginUserInfoFromToken(this.httpRequest.headers.authorization!)

      let user;

      if(
        loginUserInfo.phoneNumber?.replace("+", "").trim() === phoneNumber.trim() &&
        loginUserInfo.verificationCode?.trim() === verificationCode.trim()
      ) {
        user = await this.authService.passwordlessSignup(loginUserInfo);
      } else throw new Error('Token incorrect')

      return HttpResponseToClient.okHttpResponse({
        data: user,
        request: this.httpRequest,
        response: this.httpResponse,
      })

    } catch (err) {

      return HttpResponseToClient.badRequestErrorHttpResponse({
        message: err.message,
        logMessage: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      })

    }
  }

  @get('auth/passwordless/login')
  @response(200, {
    description: 'User has authorization',
    properties: {
      message: {type: 'string'},
      statusCode: {type: 'number'},
      data: {
        properties: {
          authToken: {type: 'string'},
          token: {type: 'string'},
          userData: {
            properties: {
              _id: {type: 'string'},
              phoneNumber: {type: 'string'},
            }
          }
        }
      }
    }
  })
  async passwordlessLogin(
    @param.query.string('phone-number') phoneNumber: string,
    @param.query.string('verification-code') verificationCode: string,
  ): Promise<IHttpResponse> {
    try {

      const tokenVerified = JwtToken.verifyAuthToken(
        this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
        this.httpRequest, this.httpResponse
      )
      if (!tokenVerified) throw serverMessages['httpResponse']['unauthorizedError'][LocaleEnum['pt-BR']]

      const loginUserInfo = JwtToken.getLoginUserInfoFromToken(this.httpRequest.headers.authorization!)

      let tokenAndUser;

      if(
        loginUserInfo.phoneNumber?.replace("+", "").trim() === phoneNumber.trim() &&
        loginUserInfo.verificationCode?.trim() === verificationCode.trim()
      ) {
        tokenAndUser = await this.authService.passwordlessLogin(phoneNumber.trim());
      } else throw new Error('Token incorrect')

      return HttpResponseToClient.okHttpResponse({
        data: {...tokenAndUser},
        message: serverMessages['auth'][tokenAndUser?.authToken ? 'loginSuccess' : 'unregisteredUser'][LocaleEnum['pt-BR']],
        statusCode: tokenAndUser?.authToken ? 200 : 601,
        request: this.httpRequest,
        response: this.httpResponse,
      })

    } catch (err) {

      return HttpResponseToClient.badRequestErrorHttpResponse({
        message: err.message,
        logMessage: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      })

    }
  }
}
