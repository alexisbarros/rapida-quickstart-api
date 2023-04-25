import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, Response, RestBindings, api, del, get, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {IApp} from '../../domain/entities';
import {IAppRepository} from '../../domain/repositories';
import {AppRepository} from '../../repositories';
import {appSchema} from '../../repositories/mongo/autentikigo/schemas/app.schema';
import {CreateApp, DeleteApp, GetAllApps, GetOneApp, ReplaceApp, UpdateApp} from '../../usecases/autentikigo/app';
import {getSwaggerRequestBodySchema, getSwaggerResponseSchema} from '../../utils/general.util';
import {IHttpResponse, badRequestErrorHttpResponse, createHttpResponse, notFoundErrorHttpResponse, okHttpResponse} from '../../utils/http-response.util';

@api({ basePath: 'autentikigo' })
export class AppController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(AppRepository) private appRepository: IAppRepository,

    @inject(SecurityBindings.USER, {optional: true}) private user?: UserProfile,
  ){}

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'App', action: 'POST'}
  })
  @post('apps')
  @response(201, getSwaggerResponseSchema())
  async create(
    @requestBody(getSwaggerRequestBodySchema(appSchema, ['_id', '_createdBy', '_ownerId']))
    data: IApp
  ): Promise<IHttpResponse> {
    try {
      const dataCreated = await new CreateApp(this.appRepository).execute({
        ...data,
        _createdBy: this.user?.userId,
        _ownerId: this.user?.userId,
      });

      return createHttpResponse({
        data: dataCreated,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        request: this.httpRequest,
        response: this.httpResponse,
        message: err.message,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'App', action: 'GET'}
  })
  @get('apps')
  @response(200, getSwaggerResponseSchema(appSchema, true))
  async findAll(
    @param.query.string('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const data = await new GetAllApps(this.appRepository).execute(
        filters ?? {},
        limit ?? 100,
        page ?? 0,
      );

      return okHttpResponse({
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'App', action: 'GET'}
  })
  @get('apps/{id}')
  @response(200, getSwaggerResponseSchema(appSchema, false))
  async findOne(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      const data = await new GetOneApp(this.appRepository).execute(id);

      return okHttpResponse({
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'App', action: 'PUT'}
  })
  @put('apps/{id}')
  @response(200, getSwaggerResponseSchema(appSchema, false))
  async replace(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(appSchema, ['_id', '_createdBy', '_ownerId']))
    data: IApp
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await new ReplaceApp(this.appRepository).execute(id, data)

      return okHttpResponse({
        data: dataUpdated,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'App', action: 'PATCH'}
  })
  @patch('apps/{id}')
  @response(200, getSwaggerResponseSchema(appSchema, false))
  async update(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(appSchema, ['_id', '_createdBy', '_ownerId']))
    data: Partial<IApp>
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await new UpdateApp(this.appRepository).execute(id, data)

      return okHttpResponse({
        data: dataUpdated,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'App', action: 'DELETE'}
  })
  @del('apps/{id}')
  @response(200, getSwaggerResponseSchema())
  async delete(
    @param.path.string('id') id: string
  ): Promise<IHttpResponse> {
    try {
      await new DeleteApp(this.appRepository).execute(id);

      return okHttpResponse({
        request: this.httpRequest,
        response: this.httpResponse,
      })
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

}
