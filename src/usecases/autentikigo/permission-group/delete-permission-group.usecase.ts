import {IPermissionGroupRepository} from '../../../domain/repositories';

export class DeletePermissionGroup {
  private repository: IPermissionGroupRepository;

  constructor(repository: IPermissionGroupRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }
}
