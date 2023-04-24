import {IModule, IPermission, IPermissionGroup, IPermissionGroupPermission} from '../../../domain/entities';
import {IModuleRepository, IPermissionRepository} from '../../../domain/repositories';

export class GetPermissionFromAUser {

  private permissionRepository: IPermissionRepository;
  private moduleRepository: IModuleRepository;

  constructor(
    permissionRepository: IPermissionRepository,
    moduleRepository: IModuleRepository,
  ){
    this.permissionRepository = permissionRepository;
    this.moduleRepository = moduleRepository;
  }

  public async execute(userId: string, appId: string): Promise<IModule[]> {
    const permissions = await this.permissionRepository
      .findAll({ user: userId }, 100, 0);

    const appPermissions = permissions
      .filter((permission: IPermission) => {
        return (permission.permissionGroup as IPermissionGroup).app === appId;
      });

    const moduleIds: string[] = appPermissions.map((permission: IPermission) => {
      return (permission.permissionGroup as IPermissionGroup).permissions
        .map((permissionGroupPermission: IPermissionGroupPermission) =>
          permissionGroupPermission.module as string
        );
    }).flat();

    return this.moduleRepository.findAll(
      {
        _id: { $in: moduleIds }
      },
      100, 0
    );
  }

}
