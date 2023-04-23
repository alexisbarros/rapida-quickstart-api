import {PermissionGroup} from '../../../domain/entities';
import {IPermissionGroupRepository} from '../../../domain/repositories';

export class GetAllPermissionGroups {
  private repository: IPermissionGroupRepository;

  constructor(repository: IPermissionGroupRepository){
    this.repository = repository;
  }

  public async execute(filters: any, limit: number, page: number): Promise<PermissionGroup[]> {
    return await this.repository.findAll(filters, limit, page);
  }
}
