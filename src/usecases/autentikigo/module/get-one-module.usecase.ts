import {Module} from '../../../domain/entities';
import {IModuleRepository} from '../../../domain/repositories';

export class GetOneModule {
  private repository: IModuleRepository;

  constructor(repository: IModuleRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<Module> {
    return await this.repository.findById(id);
  }
}
