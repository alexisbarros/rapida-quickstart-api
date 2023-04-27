import {GetPermissionsFromUser} from '.';
import {IModule, IPermission, IPermissionGroup, IPermissionGroupPermission} from '../../../domain/entities';
import {IPermissionGroupRepository, IPermissionRepository} from '../../../domain/repositories';

interface IUserHasPermissionProps {
  userId: string,
  collection: string,
  action: string,
}

export class UserHasPermission {

  private permissionRepository: IPermissionRepository;
  private permissionGroupRepository: IPermissionGroupRepository;

  constructor(
    permissionRepository: IPermissionRepository,
    permissionGroupRepository: IPermissionGroupRepository,
  ) {
    this.permissionRepository = permissionRepository;
    this.permissionGroupRepository = permissionGroupRepository;
  }

  public async execute({userId, collection, action} : IUserHasPermissionProps): Promise<boolean> {
    const permissions = await new GetPermissionsFromUser(
      this.permissionRepository
    ).execute(userId);

    const permissionGroups = await this.permissionGroupRepository
      .findAll({
      _id: {
        $in: permissions.map((permission: IPermission) => {
          return (permission.permissionGroup as IPermissionGroup)._id!.toString()
        })
      }
    }, 100, 0);

    let userHasPermission = false;
    permissionGroups.forEach((permissionGroup: IPermissionGroup) => {
      if(permissionGroup.name === 'autentikigo-admin'){
        userHasPermission = true;
      } else {
        (permissionGroup.permissions as IPermissionGroupPermission[])
          .forEach((permissionGroupPermission: IPermissionGroupPermission) => {
            if((
              permissionGroupPermission.module as IModule).collectionName === collection &&
              permissionGroupPermission.actions.includes(action)
            ){
              userHasPermission = true;
            }
          });
      }
    });

    return userHasPermission;
  }

}
