import {IPermissionGroup, PermissionGroup} from '../../../domain/entities';
import {IPermissionGroupRepository} from '../../../domain/repositories';

export class UpdatePermissionGroup {
  private repository: IPermissionGroupRepository;

  constructor(repository: IPermissionGroupRepository){
    this.repository = repository;
  }

  public async execute(id: string, permissionGroup: Partial<IPermissionGroup>): Promise<PermissionGroup> {
    return await this.repository.updateById(id, permissionGroup);
  }
}
