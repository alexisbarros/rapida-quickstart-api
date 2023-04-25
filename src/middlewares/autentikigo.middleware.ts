import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {Getter, inject} from '@loopback/core';
import {model, repository} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {IModule, IPermission, IPermissionGroup, IPermissionGroupPermission} from '../domain/entities';
import {IPermissionGroupRepository, IPermissionRepository} from '../domain/repositories';
import {PermissionGroupRepository, PermissionRepository} from '../repositories';
import {VerifyJwt} from '../usecases/autentikigo/jwt';
import {GetAllPermissionGroups} from '../usecases/autentikigo/permission-group';
import {GetPermissionsFromUser} from '../usecases/autentikigo/permission/get-permissions-fom-user.usecase';

@model()
export class Lb4User implements UserProfile {

  [securityId]: string;
  userId: string;

  constructor(data?: Partial<Lb4User>) {
    Object.assign(this, data);
  }
}

export class Autentikigo implements AuthenticationStrategy {
  name = 'autentikigo'


  constructor(
    @inject.getter(AuthenticationBindings.METADATA) readonly getMetaData: Getter<AuthenticationMetadata>,
    @inject(RestBindings.Http.RESPONSE) private response: Response,

    @repository(PermissionGroupRepository) private permissionGroupRepository: IPermissionGroupRepository,
    @repository(PermissionRepository) private permissionRepository: IPermissionRepository,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    try {
      // Só consegui acessar as options do metadata especificando ele como any
      const metadata = await this.getMetaData() as any
      const collection = metadata['0']['options']['collection']
      const action = metadata['0']['options']['action']


      const payload = new VerifyJwt().execute(request.headers.authorization);
      const userId = payload.id;

      const permissions = await new GetPermissionsFromUser(
        this.permissionRepository
      ).execute(userId);

      const permissionGroups = await new GetAllPermissionGroups(
        this.permissionGroupRepository
      ).execute({
        _id: {
          $in: permissions.map((permission: IPermission) => {
            return (permission.permissionGroup as IPermissionGroup)._id!.toString()
          })
        }
      }, 100, 0);

      let userHasPermission = false;
      console.log(collection, action);
      console.log(permissionGroups);
      permissionGroups.forEach((permissionGroup: IPermissionGroup) => {
        (permissionGroup.permissions as IPermissionGroupPermission[])
          .forEach((permissionGroupPermission: IPermissionGroupPermission) => {
            if((
              permissionGroupPermission.module as IModule).collectionName === collection &&
              permissionGroupPermission.actions.includes(action)
            ){
              userHasPermission = true;
            }
          });
      });
      if(!userHasPermission) throw new Error('User does not have permission to access this route');

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
