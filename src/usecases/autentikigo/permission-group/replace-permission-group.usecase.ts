import {IPermissionGroup, PermissionGroup} from '../../../domain/entities';
import {IPermissionGroupRepository} from '../../../domain/repositories';

export class ReplacePermissionGroup {
  private repository: IPermissionGroupRepository;

  constructor(repository: IPermissionGroupRepository){
    this.repository = repository;
  }

  public async execute(id: string, permissionGroup: IPermissionGroup): Promise<PermissionGroup> {
    return await this.repository.replaceById(id, permissionGroup);
  }
}
