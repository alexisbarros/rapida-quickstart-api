// import {inject} from '@loopback/core';
// import {
//   Request,
//   Response,
//   RestBindings
// } from '@loopback/rest';

// export class AuthController {

//   constructor(
//     @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
//     @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,
//   ) { }

//   @get('google-login-url')
//   @response(200, {
//     description: 'Google URL',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//       data: {
//         properties: {
//           url: {type: 'string'}
//         }
//       }
//     }
//   })
//   async getGoogleLoginPageUrl(
//     @param.query.string('invitation') invitationId?: string,
//     @param.query.string('client-redirect-uri') clientRedirectUri?: string,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse> {
//     try {

//       const clientRedirectUriParam = clientRedirectUri ?
//         `clientRedirectUri=${clientRedirectUri}` : ''
//       const invitationParam = invitationId ? `&invitationId=${invitationId}` : ''

//       const url = await this.authService.getOAuthLoginPageURL(
//         this.googleOAuth, `${clientRedirectUriParam}${invitationParam}`
//       )

//       return HttpResponseToClient.okHttpResponse({
//         data: {url},
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: serverMessages['auth']['getGoogleUrl'][locale ?? LocaleEnum['pt-BR']],
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @visibility(OperationVisibility.UNDOCUMENTED)
//   @get('auth/google')
//   async handleGoogleCodeAndReturnToken(
//     @param.query.string('code') code: string,
//     @param.query.string('state') state?: string,
//   ): Promise<void | IHttpResponse> {
//     try {

//       const googleUser = await this.authService.getOAuthUser(this.googleOAuth, code)

//       const invitationId = new URLSearchParams(state).get('invitationId')

//       const token = this.authService.createOAuthToken(this.googleOAuth, googleUser, invitationId)

//       const clientRedirectUri = new URLSearchParams(state).get('clientRedirectUri')
//       this.httpResponse.redirect(`${clientRedirectUri}?token=${token}`)

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: serverMessages['auth']['getGoogleUser'][LocaleEnum['en-US']],
//         logMessage: err.message,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @get('apple-login-url')
//   @response(200, {
//     description: 'Apple URL',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//       data: {
//         properties: {
//           url: {type: 'string'}
//         }
//       }
//     }
//   })
//   async getAppleLoginPageUrl(
//     @param.query.string('invitation') invitationId?: string,
//     @param.query.string('client-redirect-uri') clientRedirectUri?: string,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse> {
//     try {

//       const clientRedirectUriParam = clientRedirectUri ?
//         `clientRedirectUri=${clientRedirectUri}` : ''
//       const invitationParam = invitationId ? `&invitationId=${invitationId}` : ''

//       const url = await this.authService.getOAuthLoginPageURL(
//         this.appleOAuth, `${clientRedirectUriParam}${invitationParam}`
//       )

//       return HttpResponseToClient.okHttpResponse({
//         data: {url},
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: serverMessages['auth']['getAppleUrl'][locale ?? LocaleEnum['pt-BR']],
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @visibility(OperationVisibility.UNDOCUMENTED)
//   @post('auth/apple')
//   async handleAppleCodeAndReturnToken(
//     @requestBody({
//       content: {
//         'application/x-www-form-urlencoded': {
//           schema: {type: 'object'},
//         }
//       }
//     }) data: IAppleBodySigninReturn,
//   ): Promise<void | IHttpResponse> {
//     try {

//       const appleUser = await this.authService.getOAuthUser(this.appleOAuth, data.code)

//       const invitationId = new URLSearchParams(data.state).get('invitationId')

//       const token = this.authService.createOAuthToken(this.appleOAuth, appleUser, invitationId)

//       const clientRedirectUri = new URLSearchParams(data.state).get('clientRedirectUri')
//       this.httpResponse.redirect(`${clientRedirectUri}?token=${token}`)

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: serverMessages['auth']['getAppleUser'][LocaleEnum['en-US']],
//         logMessage: err.message,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @get('login')
//   @response(200, {
//     description: 'Auth token',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//       data: {
//         properties: {
//           authToken: {type: 'string'},
//           authRefreshToken: {type: 'string'},
//           userData: getModelSchemaRef(User, {includeRelations: true}),
//         }
//       }
//     }
//   })
//   async login(
//     @param.query.string('project-id') projectId: string,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse | undefined> {
//     try {

//       const tokenVerified = JwtToken.verifyAuthToken(
//         this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
//         this.httpRequest, this.httpResponse, locale
//       )
//       if (!tokenVerified) return

//       const loginUserInfo = JwtToken.getLoginUserInfoFromToken(this.httpRequest.headers.authorization!)

//       const tokenAndUser = await this.authService.login(loginUserInfo, projectId)

//       return HttpResponseToClient.okHttpResponse({
//         data: {...tokenAndUser},
//         message: serverMessages['auth'][tokenAndUser?.authToken ? 'loginSuccess' : 'unregisteredUser'][locale ?? LocaleEnum['pt-BR']],
//         statusCode: tokenAndUser?.authToken ? 200 : 601,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })


//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @post('signup')
//   @response(200, {
//     description: 'User registered',
//     properties: HttpDocumentation.createDocResponseSchemaForFindOneResult(User)
//   })
//   async signup(
//     @requestBody({
//       content: HttpDocumentation.createDocRequestSchema(Signup)
//     }) data: Signup,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse | undefined> {
//     try {

//       const tokenVerified = JwtToken.verifyAuthToken(
//         this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
//         this.httpRequest, this.httpResponse, locale
//       )
//       if (!tokenVerified) return

//       const loginUserInfo = JwtToken.getLoginUserInfoFromToken(this.httpRequest.headers.authorization!)

//       const userWithProfile = await this.authService.signup(data, loginUserInfo, this.getProfile)

//       return HttpResponseToClient.okHttpResponse({
//         data: userWithProfile,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: err.message,
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @get('refresh-token')
//   @response(200, {
//     description: 'Auth token',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//       data: {
//         properties: {
//           authToken: {type: 'string'},
//           authRefreshToken: {type: 'string'},
//         }
//       }
//     }
//   })
//   async refreshToken(
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse | undefined> {
//     try {

//       const tokenVerified = JwtToken.verifyAuthToken(
//         this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
//         this.httpRequest, this.httpResponse, locale
//       )
//       if (!tokenVerified) return

//       const userId = JwtToken.getUserIdFromToken(this.httpRequest.headers.authorization!)

//       const authToken = await this.authService.refreshToken(userId);

//       return HttpResponseToClient.okHttpResponse({
//         data: authToken,
//         message: serverMessages['auth']['refreshTokenSuccess'][locale ?? LocaleEnum['pt-BR']],
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: serverMessages['auth']['refreshTokenError'][locale ?? LocaleEnum['pt-BR']],
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @get('verify-authorization')
//   @response(200, {
//     description: 'User has authorization',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//       data: {
//         properties: {
//           userId: {type: 'string'},
//           ownerId: {type: 'string'},
//         }
//       }
//     }
//   })
//   async verifyAuthorization(
//     @param.query.string('collection') collection: string,
//     @param.query.string('action') action: string,
//     @param.query.string('project-id') projectId: string,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse> {
//     try {

//       const tokenVerified = JwtToken.verifyAuthToken(
//         this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
//         this.httpRequest, this.httpResponse, locale
//       )
//       if (!tokenVerified) throw serverMessages['httpResponse']['unauthorizedError'][LocaleEnum['pt-BR']]

//       const userId = JwtToken.getUserIdFromToken(this.httpRequest.headers.authorization!)

//       const data = await this.authService.verifyAuthorization(userId, action, collection, projectId);

//       return HttpResponseToClient.okHttpResponse({
//         data,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: err.message,
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @visibility(OperationVisibility.UNDOCUMENTED)
//   @post('generate-jwt')
//   @response(200, {
//     description: 'JWT',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//       data: {type: 'string'}
//     }
//   })
//   async generateJwt(
//     @requestBody() data: any,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse | undefined> {
//     try {

//       const token = jwt.sign(
//         data.payload,
//         process.env.AUTENTIKIGO_SECRET!, {
//         expiresIn: data.expiresIn || '1d'
//       })

//       return HttpResponseToClient.okHttpResponse({
//         data: token,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: err.message,
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @visibility(OperationVisibility.UNDOCUMENTED)
//   @get('verify-jwt-authorization')
//   @response(200, {
//     description: 'JWT is ok',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//       data: {}
//     }
//   })
//   async verifyJwtAuthorization(
//     @param.query.string('token') token: string,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse | undefined> {
//     try {

//       const tokenVerified = JwtToken.verifyAuthToken(
//         token!, process.env.AUTENTIKIGO_SECRET!,
//         this.httpRequest, this.httpResponse, locale
//       )
//       if (!tokenVerified) return

//       return HttpResponseToClient.okHttpResponse({
//         data: tokenVerified,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         message: err.message,
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }

//   @visibility(OperationVisibility.UNDOCUMENTED)
//   @get('get-profile')
//   @response(200, {
//     description: 'Get Profile info',
//     properties: {
//       message: {type: 'string'},
//       statusCode: {type: 'number'},
//     }
//   })
//   async getUserProfile(
//     @param.query.string('userType') userType: UserTypesEnum,
//     @param.query.string('uniqueId') uniqueId: string,
//     @param.query.string('country') countryId?: string,
//     @param.query.string('locale') locale?: LocaleEnum,
//   ): Promise<IHttpResponse | undefined> {
//     try {

//       if (!userType || !uniqueId) throw new Error('userType and uniqueId are required')

//       const tokenVerified = JwtToken.verifyAuthToken(
//         this.httpRequest.headers.authorization!, process.env.AUTENTIKIGO_SECRET!,
//         this.httpRequest, this.httpResponse, locale
//       )
//       if (!tokenVerified) throw new Error(serverMessages['httpResponse']['unauthorizedError'][locale ?? LocaleEnum['pt-BR']])

//       uniqueId = uniqueId.replace(/\D/g, "");

//       const profile =
//         await this[`${userType}Repository`].findOne({where: {uniqueId}}) ??
//         await this.getProfile.getFullProfileInfo(uniqueId, userType, undefined, this[`${userType}Repository`], countryId)

//       if (!profile) throw new Error(serverMessages['auth']['uniqueIdNotFound'][locale ?? LocaleEnum['pt-BR']])

//       return HttpResponseToClient.okHttpResponse({
//         data: {
//           ...(profile ?? {}),
//           birthday: `${profile.birthday!.toISOString().substring(0, 10)}T12:00:00.000+00:00`
//         },
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     } catch (err) {

//       return HttpResponseToClient.badRequestErrorHttpResponse({
//         logMessage: err.message,
//         locale,
//         request: this.httpRequest,
//         response: this.httpResponse,
//       })

//     }
//   }
// }
