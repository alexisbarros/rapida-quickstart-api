import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, Response, RestBindings, api, del, get, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {IPermissionGroup} from '../../domain/entities';
import {IPermissionGroupRepository} from '../../domain/repositories';
import {PermissionGroupRepository} from '../../repositories';
import {permissionGroupSchema} from '../../repositories/mongo/autentikigo/schemas/permission-group.schema';
import {CreatePermissionGroup, DeletePermissionGroup, GetAllPermissionGroups, GetOnePermissionGroup, ReplacePermissionGroup, UpdatePermissionGroup} from '../../usecases/autentikigo/permission-group';
import {getSwaggerRequestBodySchema, getSwaggerResponseSchema} from '../../utils/general.util';
import {IHttpResponse, badRequestErrorHttpResponse, createHttpResponse, notFoundErrorHttpResponse, okHttpResponse} from '../../utils/http-response.util';

@api({ basePath: 'autentikigo' })
export class PermissionGroupController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(PermissionGroupRepository) private permissionGroupRepository: IPermissionGroupRepository,
  ){}

  @post('permission-groups')
  @response(201, getSwaggerResponseSchema())
  async create(
    @requestBody(getSwaggerRequestBodySchema(permissionGroupSchema, ['_id', '_createdBy', '_ownerId']))
    data: IPermissionGroup
  ): Promise<IHttpResponse> {
    try {
      const dataCreated = await new CreatePermissionGroup(this.permissionGroupRepository).execute(data);

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

  @get('permission-groups')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, true))
  async findAll(
    @param.query.string('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const data = await new GetAllPermissionGroups(this.permissionGroupRepository).execute(
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

  @get('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, false))
  async findOne(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      const data = await new GetOnePermissionGroup(this.permissionGroupRepository).execute(id);

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

  @put('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, false))
  async replace(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(permissionGroupSchema, ['_id', '_createdBy', '_ownerId']))
    data: IPermissionGroup
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await new ReplacePermissionGroup(this.permissionGroupRepository).execute(id, data)

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

  @patch('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema(permissionGroupSchema, false))
  async update(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(permissionGroupSchema, ['_id', '_createdBy', '_ownerId']))
    data: Partial<IPermissionGroup>
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await new UpdatePermissionGroup(this.permissionGroupRepository).execute(id, data)

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

  @del('permission-groups/{id}')
  @response(200, getSwaggerResponseSchema())
  async delete(
    @param.path.string('id') id: string
  ): Promise<IHttpResponse> {
    try {
      await new DeletePermissionGroup(this.permissionGroupRepository).execute(id);

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
