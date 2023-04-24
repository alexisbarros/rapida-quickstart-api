import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, Response, RestBindings, api, get, param, response} from '@loopback/rest';
import {IModuleRepository, IPermissionRepository, IPersonRepository} from '../../domain/repositories';
import {ModuleRepository, PermissionRepository, PersonRepository} from '../../repositories';
import {moduleSchema} from '../../repositories/mongo/autentikigo/schemas/module.schema';
import {personSchema} from '../../repositories/mongo/autentikigo/schemas/person.schema';
import {GetPermissionFromAUser} from '../../usecases/autentikigo/permission';
import {GetPersonDataFromUser} from '../../usecases/autentikigo/person';
import {getSwaggerResponseSchema} from '../../utils/general.util';
import {IHttpResponse, badRequestErrorHttpResponse, notFoundErrorHttpResponse, okHttpResponse} from '../../utils/http-response.util';

@api({ basePath: 'autentikigo' })
export class UserController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(PersonRepository) private personRepository: IPersonRepository,
    @repository(PermissionRepository) private permissionRepository: IPermissionRepository,
    @repository(ModuleRepository) private moduleRepository: IModuleRepository,
  ){}

  @get('user/permissions')
  @response(200, getSwaggerResponseSchema(moduleSchema, true))
  async getUserPermissions(
    @param.query.string('appId', { required: true }) appId: string,
  ): Promise<IHttpResponse> {
    try {
      const userId = '';

      const data = await new GetPermissionFromAUser(
        this.permissionRepository, this.moduleRepository
      ).execute(userId, appId);

      return okHttpResponse({
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @get('user/profile')
  @response(200, getSwaggerResponseSchema(personSchema))
  async getUserProfile(): Promise<IHttpResponse> {
    try {
      const userId = '';

      const data = await new GetPersonDataFromUser(
        this.personRepository
      ).execute(userId);

      return okHttpResponse({
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }catch(err) {
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
