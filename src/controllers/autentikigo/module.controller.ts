import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, Response, RestBindings, api, del, get, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {IModule} from '../../domain/entities';
import {IModuleRepository} from '../../domain/repositories';
import {ModuleRepository} from '../../repositories';
import {moduleSchema} from '../../repositories/mongo/autentikigo/schemas/module.schema';
import {CreateModule, DeleteModule, GetAllModules, GetOneModule, ReplaceModule, UpdateModule} from '../../usecases/autentikigo/module';
import {getSwaggerRequestBodySchema, getSwaggerResponseSchema} from '../../utils/general.util';
import {IHttpResponse, badRequestErrorHttpResponse, createHttpResponse, notFoundErrorHttpResponse, okHttpResponse} from '../../utils/http-response.util';

@api({ basePath: 'autentikigo' })
export class ModuleController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(ModuleRepository) private moduleRepository: IModuleRepository,

    @inject(SecurityBindings.USER, {optional: true}) private user?: UserProfile,
  ){}

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Module', action: 'POST'}
  })
  @post('modules')
  @response(201, getSwaggerResponseSchema())
  async create(
    @requestBody(getSwaggerRequestBodySchema(moduleSchema, ['_id', '_createdBy', '_ownerId']))
    data: IModule
  ): Promise<IHttpResponse> {
    try {
      const dataCreated = await new CreateModule(this.moduleRepository).execute({
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
        message: err.message
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Module', action: 'GET'}
  })
  @get('modules')
  @response(200, getSwaggerResponseSchema(moduleSchema, true))
  async findAll(
    @param.query.string('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const data = await new GetAllModules(this.moduleRepository).execute(
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
    options: {collection: 'Module', action: 'GET'}
  })
  @get('modules/{id}')
  @response(200, getSwaggerResponseSchema(moduleSchema, false))
  async findOne(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      const data = await new GetOneModule(this.moduleRepository).execute(id);

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
    options: {collection: 'Module', action: 'PUT'}
  })
  @put('modules/{id}')
  @response(200, getSwaggerResponseSchema(moduleSchema, false))
  async replace(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(moduleSchema, ['_id', '_createdBy', '_ownerId']))
    data: IModule
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await new ReplaceModule(this.moduleRepository).execute(id, data)

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
    options: {collection: 'Module', action: 'PATCH'}
  })
  @patch('modules/{id}')
  @response(200, getSwaggerResponseSchema(moduleSchema, false))
  async update(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(moduleSchema, ['_id', '_createdBy', '_ownerId']))
    data: Partial<IModule>
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await new UpdateModule(this.moduleRepository).execute(id, data)

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
    options: {collection: 'Module', action: 'DELETE'}
  })
  @del('modules/{id}')
  @response(200, getSwaggerResponseSchema())
  async delete(
    @param.path.string('id') id: string
  ): Promise<IHttpResponse> {
    try {
      await new DeleteModule(this.moduleRepository).execute(id);

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
