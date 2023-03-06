import {inject, service} from '@loopback/core';
import {
  get, param, post, Request, requestBody, response, Response,
  RestBindings,
  SchemaObject
} from '@loopback/rest';
import {LocaleEnum} from '../enums/locale.enum';
import {HttpResponseToClient, JwtToken} from '../implementations/index';
import {PasswordlessAuthImplementation} from '../implementations/passwordless-auth.implementation';
import {IPasswordlessAuth, IPasswordlessUserData} from '../interfaces/auth.interface';
import {IHttpResponse} from '../interfaces/http.interface';
import {PasswordlessAuthService} from '../services/passwordless-auth.service';
import {serverMessages} from '../utils/server-messages';
import {getOnlyNumberFromString} from '../utils/string-manipulation-functions';

const PasswordlessSignupSchema: SchemaObject = {
  type: 'object',
  required: ['phoneNumber', 'verificationCode', 'name'],
  properties: {
    phoneNumber: { type: 'string' },
    verificationCode: { type: 'string' },
    name: { type: 'string' },
    uniqueId: { type: 'string' },
    termsAcceptanceDate: {type: 'number'},
    receivesSms: {type: 'boolean'},
    receivesWhatsapp: {type: 'boolean'},
    picture: {type: 'string'},
    zipcode: {type: 'string'},
    birthdayTimestamp: {type: 'number'},
    gender: {type: 'string'}
  },
};

export class PasswordlessAuthController {

  private passwordlessAuth: IPasswordlessAuth

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @service(PasswordlessAuthService) private passwordlessAuthService: PasswordlessAuthService,
  ) {
    this.passwordlessAuth = new PasswordlessAuthImplementation()
  }

  @get('passwordless/send-verification')
  @response(200, {
    description: 'Json web token',
    properties: {
      message: {type: 'string'},
      statusCode: {type: 'number'},
      data: {
        properties: {
          authToken: {type: 'string'},
        }
      }
    }
  })
  async sendPasswordlessVerificationCode(
    @param.query.string('phone-number') phoneNumber: string,
  ): Promise<IHttpResponse> {
    try {

      const token = this.passwordlessAuthService.createPasswordlessToken();

      const authToken = await this.passwordlessAuthService.sendPasswordlessToken(
        this.passwordlessAuth,
        phoneNumber,
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

  @post('passwordless/signup')
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
    @requestBody({
      description: 'Signup form',
      required: true,
      content: {
        'application/json': {schema: PasswordlessSignupSchema},
      },
    }) data: any,
    @param.query.string('locale') locale?: LocaleEnum,
  ): Promise<IHttpResponse> {
    try {

      const userData: IPasswordlessUserData = {...data}

      const personData = data
      delete personData['phoneNumber']
      delete personData['verificationCode']

      const tokenVerified = JwtToken.verifyAuthToken(
        this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
        this.httpRequest, this.httpResponse
      )
      if (!tokenVerified) throw serverMessages['httpResponse']['unauthorizedError'][LocaleEnum['pt-BR']]

      const loginUserInfo = JwtToken.getLoginUserInfoFromToken(this.httpRequest.headers.authorization!)

      let user;

      if(
        getOnlyNumberFromString(loginUserInfo.phoneNumber) === getOnlyNumberFromString(userData.phoneNumber) &&
        getOnlyNumberFromString(loginUserInfo.verificationCode) === getOnlyNumberFromString(userData.verificationCode)
      ) {
        user = await this.passwordlessAuthService.passwordlessSignup(userData, personData);
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

  @get('passwordless/login')
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
        getOnlyNumberFromString(loginUserInfo.phoneNumber) === getOnlyNumberFromString(phoneNumber) &&
        getOnlyNumberFromString(loginUserInfo.verificationCode) === getOnlyNumberFromString(verificationCode)
      ) {
        tokenAndUser = await this.passwordlessAuthService.passwordlessLogin(phoneNumber.trim());
      } else throw new Error('Token incorrect');

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
