import {IModule, IPermission, IPermissionGroup, IPermissionGroupPermission} from '../../../domain/entities';
import {IModuleRepository, IPermissionRepository} from '../../../domain/repositories';

export class GetAppModulesThatUserHasPermission {

  private permissionRepository: IPermissionRepository;
  private moduleRepository: IModuleRepository;

  constructor(
    permissionRepository: IPermissionRepository,
    moduleRepository: IModuleRepository,
  ){
    this.permissionRepository = permissionRepository;
    this.moduleRepository = moduleRepository;
  }

  public async execute(userId: string, appId?: string): Promise<IModule[]> {
    const permissions = await this.permissionRepository
      .findAll({ user: userId }, 100, 0);

    const appPermissions = appId ? permissions
      .filter((permission: IPermission) => {
        return (permission.permissionGroup as IPermissionGroup).app.toString() === appId;
      }) : permissions;

    const modules: any[] = appPermissions.map((permission: IPermission) => {
      return (permission.permissionGroup as IPermissionGroup).permissions
        .map((permissionGroupPermission: IPermissionGroupPermission) => {
          return {
            module: permissionGroupPermission.module as string,
            actions: permissionGroupPermission.module,
          }
        });
    }).flat();

    return this.moduleRepository.findAll(
      {
        _id: { $in: modules.map((el: any) => el.module) }
      },
      100, 0
    );
  }

}
