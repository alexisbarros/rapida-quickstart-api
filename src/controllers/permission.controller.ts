import {authenticate} from '@loopback/authentication'
import {inject} from '@loopback/core'
import {
  repository
} from '@loopback/repository'
import {del, get, param, patch, post, put, Request, requestBody, response, Response, RestBindings} from '@loopback/rest'
import {SecurityBindings, securityId, UserProfile} from '@loopback/security'
import {HttpClass} from '../classes/http.class'
import {Permission, PermissionAction} from '../models'
import {PermissionRepository} from '../repositories'
import {PermissionHasActionsRepository} from '../repositories/permission-has-actions.repository'
import {localeMessage, serverMessages} from '../utils/server-messages'

export class PermissionController {

  private httpClass

  constructor(
    @repository(PermissionRepository) public permissionRepository: PermissionRepository,
    @repository(PermissionHasActionsRepository) private permissionHasActionsRepository: PermissionHasActionsRepository,

    @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: Response,

    @inject(SecurityBindings.USER, {optional: true}) private currentUser?: UserProfile,
  ) {
    this.httpClass = new HttpClass({response: this.response, request: this.request})
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission', action: 'createOne'}})
  @post('/permissions')
  @response(200, {
    description: 'Permission model instance',
    properties: new HttpClass().findOneSchema(Permission)
  })
  async create(
    @requestBody({content: new HttpClass().requestSchema(Permission)}) data: any,
  ): Promise<void> {
    try {
      const _createdBy = this.currentUser?.[securityId] as string
      const permission = await this.permissionRepository.create({...data, _createdBy})
      this.httpClass.createResponse({data: permission})
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['create'][localeMessage],
        logMessage: err.message
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission'}})
  @get('/permissions')
  @response(200, {
    description: 'Array of Permission model instances',
    properties: new HttpClass().findAllResponseSchema(Permission)
  })
  async find(
    @param.query.number('limit') limit: number,
    @param.query.number('page') page: number,
    @param.query.string('order_by') order_by: string,
  ): Promise<void> {
    try {
      const filters = this.httpClass.createFilterRequestParams(this.request.url)
      const result = await this.permissionRepository.find({...filters, include: ['permissionActions', 'module']})
      const total = await this.permissionRepository.count(filters['where'])
      this.httpClass.okResponse({
        data: {total: total?.count, result},
        message: serverMessages['crudSuccess']['read'][localeMessage],
      })
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['read'][localeMessage],
        logMessage: err.message
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission'}})
  @get('/permissions/{permissionId}')
  @response(200, {
    description: 'Permission model instance',
    properties: new HttpClass().findOneSchema(Permission)
  })
  async findById(
    @param.path.string('permissionId') id: string,
  ): Promise<void> {
    try {
      const data = await this.permissionRepository.findById(id, {include: ['permissionActions', 'module']})
      this.httpClass.okResponse({
        data,
        message: serverMessages['crudSuccess']['read'][localeMessage]
      })
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['read'][localeMessage],
        logMessage: err.message
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission', action: 'updateOne'}})
  @put('/permissions/{permissionId}')
  @response(200, {description: 'Permission PUT success'})
  async updateById(
    @param.path.string('permissionId') id: string,
    @requestBody({content: new HttpClass().requestSchema(Permission)}) data: any,
  ): Promise<void> {
    try {
      await this.permissionRepository.updateById(id, data)
      this.httpClass.noContentResponse()
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['update'][localeMessage],
        logMessage: err.message,
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission', action: 'updateOne'}})
  @patch('/permissions/{permissionId}')
  @response(200, {description: 'Permission PATCH success'})
  async partialUpdateById(
    @param.path.string('permissionId') id: string,
    @requestBody({content: new HttpClass().requestSchema(Permission, true)}) data: any,
  ): Promise<void> {
    try {
      await this.permissionRepository.updateById(id, data)
      this.httpClass.noContentResponse()
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['update'][localeMessage],
        logMessage: err.message,
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission', action: 'deleteOne'}})
  @del('/permissions/{permissionId}')
  @response(204, {description: 'Permission DELETE success'})
  async deleteById(
    @param.path.string('permissionId') id: string
  ): Promise<void> {
    try {
      await this.permissionRepository.deleteById(id)
      this.httpClass.noContentResponse()
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['delete'][localeMessage],
        logMessage: err.message,
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission', action: 'create'}})
  @post('/permissions/{permissionId}/permission-actions')
  @response(200, {
    description: 'create a PermissionAction model instance',
    properties: new HttpClass().findOneSchema(Permission)
  })
  async createPermissionActionsRelated(
    @param.path.string('permissionId') permissionId: string,
    @requestBody({
      content: {
        'application/json': {schema: {type: 'array', items: {type: 'string'}}}
      }
    })
    permissionActionIds: string[],
  ): Promise<void> {
    try {
      await this.permissionHasActionsRepository.createAll(permissionActionIds.map((permissionActionId) => {
        return {permissionId, permissionActionId}
      }))
      const data = await this.permissionRepository.findById(permissionId, {include: ['permissionActions', 'module']})
      this.httpClass.createResponse({data})
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['create'][localeMessage],
        logMessage: err.message
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission'}})
  @get('/permissions/{permissionId}/permission-actions')
  @response(200, {
    description: 'Array of Permission has many PermissionAction through PermissionHasActions',
    properties: new HttpClass().findAllResponseSchema(PermissionAction)
  })
  async findPermissionActionsRelated(
    @param.path.string('permissionId') id: string,
    @param.query.number('limit') limit: number,
    @param.query.number('page') page: number,
    @param.query.string('order_by') order_by: string,
  ): Promise<void> {
    try {
      const filters = this.httpClass.createFilterRequestParams(this.request.url)
      const result = await this.permissionRepository.permissionActions(id).find(filters)
      const total = (await this.permissionRepository.permissionActions(id).find({where: filters['where']})).length
      this.httpClass.okResponse({
        data: {total: total, result},
        message: serverMessages['crudSuccess']['read'][localeMessage],
      })
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['read'][localeMessage],
        logMessage: err.message
      })
    }
  }

  @authenticate({strategy: 'autentikigo', options: {collection: 'Permission', action: 'delete'}})
  @del('/permissions/{permissionId}/permission-actions')
  @response(200, {
    description: 'delete a PermissionAction model instance',
    properties: new HttpClass().findOneSchema(Permission)
  })
  async deletePermissionActionsRelated(
    @param.path.string('permissionId') permissionId: string,
    @requestBody({
      content: {
        'application/json': {schema: {type: 'array', items: {type: 'string'}}}
      }
    })
    permissionActionIds: string[],
  ): Promise<void> {
    try {
      await this.permissionHasActionsRepository.deleteAll({
        or:
          (permissionActionIds.map((permissionActionId) => {return {and: [{permissionId}, {permissionActionId}]}}))
      })
      const data = await this.permissionRepository.findById(permissionId, {include: ['permissionActions', 'module']})
      this.httpClass.okResponse({
        message: serverMessages['crudSuccess']['delete'][localeMessage],
        data
      })
    } catch (err) {
      this.httpClass.badRequestErrorResponse({
        message: serverMessages['crudError']['delete'][localeMessage],
        logMessage: err.message
      })
    }
  }
}
