import {IModule, Module} from '../../../domain/entities';
import {IModuleRepository} from '../../../domain/repositories';

export class ReplaceModule {
  private repository: IModuleRepository;

  constructor(repository: IModuleRepository){
    this.repository = repository;
  }

  public async execute(id: string, module: IModule): Promise<Module> {
    return await this.repository.replaceById(id, module);
  }
}
