import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {OperationVisibility, Request, Response, RestBindings, api, del, get, param, patch, post, put, requestBody, response, visibility} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {IModule, IPermissionGroup} from '../../domain/entities';
import {IModuleRepository, IPermissionGroupRepository} from '../../domain/repositories';
import {ModuleRepository, PermissionGroupRepository} from '../../repositories';
import {permissionGroupSchema} from '../../repositories/mongo/autentikigo/schemas/permission-group.schema';
import {getSwaggerRequestBodySchema, getSwaggerResponseSchema} from '../../utils/general.util';
import {IHttpResponse, badRequestErrorHttpResponse, createHttpResponse, notFoundErrorHttpResponse, okHttpResponse} from '../../utils/http-response.util';

@api({ basePath: 'autentikigo' })
export class PermissionGroupController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(PermissionGroupRepository) private permissionGroupRepository: IPermissionGroupRepository,
    @repository(ModuleRepository) private moduleRepository: IModuleRepository,

    @inject(SecurityBindings.USER, {optional: true}) private user?: UserProfile,
  ){}

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'PermissionGroup', action: 'POST'}
  })
  @post('permission-groups')
  @response(201, getSwaggerResponseSchema())
  async create(
    @requestBody(getSwaggerRequestBodySchema(permissionGroupSchema, ['_id', '_createdBy', '_ownerId']))
    data: IPermissionGroup
  ): Promise<IHttpResponse> {
    try {
      const dataCreated = await this.permissionGroupRepository.create({
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
    options: {collection: 'PermissionGroup', action: 'GET'}
  })
  @get('permission-groups')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, true))
  async findAll(
    @param.query.string('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.permissionGroupRepository.findAll(
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
    options: {collection: 'PermissionGroup', action: 'GET'}
  })
  @get('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, false))
  async findOne(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.permissionGroupRepository.findById(id);

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
    options: {collection: 'PermissionGroup', action: 'PUT'}
  })
  @put('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, false))
  async replace(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(permissionGroupSchema, ['_id', '_createdBy', '_ownerId']))
    data: IPermissionGroup
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await this.permissionGroupRepository.replaceById(id, data)

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
    options: {collection: 'PermissionGroup', action: 'PATCH'}
  })
  @patch('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, false))
  async update(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(permissionGroupSchema, ['_id', '_createdBy', '_ownerId']))
    data: Partial<IPermissionGroup>
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await this.permissionGroupRepository.updateById(id, data)

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
    options: {collection: 'PermissionGroup', action: 'DELETE'}
  })
  @del('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema())
  async delete(
    @param.path.string('id') id: string
  ): Promise<IHttpResponse> {
    try {
      await this.permissionGroupRepository.deleteById(id);

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

  @visibility(OperationVisibility.UNDOCUMENTED)
  @get('permission-groups/admin/seed')
  @response(200, getSwaggerResponseSchema())
  async seed(): Promise<IHttpResponse> {
    try {
      const modules: IModule[] = await this.moduleRepository.findAll({}, 100, 0);

      const data: IPermissionGroup = await this.permissionGroupRepository.create({
        name: 'autentikigo-admin',
        description: 'admin',
        app: '',
        permissions: modules.map((module: IModule) => {
          return {
            module: module._id!,
            actions: [
              'GET',
              'POST',
              'PUT',
              'PATCH',
              'DELETE',
            ],
          }
        }),
        _createdBy: '',
        _ownerId: '',
      });

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

}
