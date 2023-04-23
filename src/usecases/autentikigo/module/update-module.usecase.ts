import {IModule, Module} from '../../../domain/entities';
import {IModuleRepository} from '../../../domain/repositories';

export class UpdateModule {
  private repository: IModuleRepository;

  constructor(repository: IModuleRepository){
    this.repository = repository;
  }

  public async execute(id: string, module: Partial<IModule>): Promise<Module> {
    return await this.repository.updateById(id, module);
  }
}
