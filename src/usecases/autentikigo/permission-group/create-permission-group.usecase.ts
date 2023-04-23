import {IPermissionGroup, PermissionGroup} from '../../../domain/entities';
import {IPermissionGroupRepository} from '../../../domain/repositories';

export class CreatePermissionGroup {
  private repository: IPermissionGroupRepository;

  constructor(repository: IPermissionGroupRepository){
    this.repository = repository;
  }

  public async execute(permissionGroup: IPermissionGroup): Promise<PermissionGroup> {
    return await this.repository.create(permissionGroup);
  }
}
