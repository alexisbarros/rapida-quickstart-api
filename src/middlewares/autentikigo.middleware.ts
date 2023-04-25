import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {Getter, inject} from '@loopback/core';
import {model, repository} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {IModuleRepository, IPermissionGroupRepository, IPermissionRepository} from '../domain/repositories';
import {ModuleRepository, PermissionGroupRepository, PermissionRepository} from '../repositories';
import {VerifyJwt} from '../usecases/autentikigo/jwt';
import {GetPermissionFromAUser} from '../usecases/autentikigo/permission';
import {GetAllPermissionGroups} from '../usecases/autentikigo/permission-group';

@model()
export class Lb4User implements UserProfile {

  [securityId]: string;
  userId: string;

  constructor(data?: Partial<Lb4User>) {
    Object.assign(this, data);
  }
}

export class AutentikigoStrategy implements AuthenticationStrategy {
  name = 'autentikigo'


  constructor(
    @inject.getter(AuthenticationBindings.METADATA) readonly getMetaData: Getter<AuthenticationMetadata>,
    @inject(RestBindings.Http.RESPONSE) private response: Response,

    @repository(PermissionGroupRepository) private permissionGroupRepository: IPermissionGroupRepository,
    @repository(PermissionRepository) private permissionRepository: IPermissionRepository,
    @repository(ModuleRepository) private moduleRepository: IModuleRepository,
    // @repository(UserRepository) private userRepository: UserRepository,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    try {
      // Só consegui acessar as options do metadata especificando ele como any
      const metadata = await this.getMetaData() as any
      const collection = metadata['0']['options']['collection']
      const action = metadata['0']['options']['action']


      const payload = new VerifyJwt().execute(request.headers.authorization);
      const userId = payload.id;

      const permissions = await new GetAllPermissionGroups(
        this.permissionGroupRepository
      ).execute({ user: userId }, 20, 0);

      const modules = await new GetPermissionFromAUser(
        this.permissionRepository,
        this.moduleRepository,
      ).execute(userId);


      // const permissionGroups = await this.userRepository
      //   .permissionGroups(userId)
      //   .find({
      //     where: {projectId: process.env.PROJECT_ID},
      //     include: [{
      //       relation: 'permissions', scope: {
      //         include: [
      //           {relation: 'permissionActions', scope: {where: {name: action}}},
      //           {relation: 'module', scope: {where: {collection}}}
      //         ]
      //       }
      //     }]
      //   })
      // const permissionGroup = permissionGroups[0]

      // if (action) {
      //   if (permissionGroup) {//} && permissionGroup.name !== 'Kunlatek - Admin') {
      //     let userHasPermission = false;
      //     permissionGroup.permissions?.forEach(permission => {
      //       if (permission.module && permission.permissionActions.length) {
      //         userHasPermission = true
      //         ownerId = permissionGroup._createdBy
      //       }
      //     })
      //     if (!userHasPermission) throw serverMessages['httpResponse']['unauthorizedError'][LocaleEnum['pt-BR']]
      //   } else throw serverMessages['httpResponse']['unauthorizedError'][LocaleEnum['pt-BR']]
      // }

      const userProfile = new Lb4User({ userId, [securityId]: userId.toString() })
      return userProfile

    } catch (err) {

      this.response.status(401)
      this.response.send({
        statusCode: 401,
        message: err.message,
        logMessage: err.message
      })

      return
    }
  }
}
