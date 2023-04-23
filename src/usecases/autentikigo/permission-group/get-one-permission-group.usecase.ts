import {PermissionGroup} from '../../../domain/entities';
import {IPermissionGroupRepository} from '../../../domain/repositories';

export class GetOnePermissionGroup {
  private repository: IPermissionGroupRepository;

  constructor(repository: IPermissionGroupRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<PermissionGroup> {
    return await this.repository.findById(id);
  }
}
