import {Permission} from '../../../domain/entities';
import {IPermissionRepository} from '../../../domain/repositories';

export class GetPermissionsFromUser {

  private repository: IPermissionRepository;

  constructor(repository: IPermissionRepository){
    this.repository = repository;
  }

  public async execute(userId: string): Promise<Permission[]> {
    return (await this.repository.findAll({ user: userId }, 100, 0));
  }

}
