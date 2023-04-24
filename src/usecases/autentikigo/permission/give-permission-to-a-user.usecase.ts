import {IPermission, Permission} from '../../../domain/entities';
import {IPermissionRepository} from '../../../domain/repositories';

export class GivePermissionToAUse {

  private repository: IPermissionRepository;

  constructor(repository: IPermissionRepository){
    this.repository = repository;
  }

  public async execute(permission: IPermission): Promise<Permission> {
    return await this.repository.create(permission);
  }

}
