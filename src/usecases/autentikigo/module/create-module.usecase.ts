import {IModule, Module} from '../../../domain/entities';
import {IModuleRepository} from '../../../domain/repositories';

export class CreateModule {
  private repository: IModuleRepository;

  constructor(repository: IModuleRepository){
    this.repository = repository;
  }

  public async execute(module: IModule): Promise<Module> {
    return await this.repository.create(module);
  }
}
