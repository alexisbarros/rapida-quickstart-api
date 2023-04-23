import {Module} from '../../../domain/entities';
import {IModuleRepository} from '../../../domain/repositories';

export class GetAllModules {
  private repository: IModuleRepository;

  constructor(repository: IModuleRepository){
    this.repository = repository;
  }

  public async execute(filters: any, limit: number, page: number): Promise<Module[]> {
    return await this.repository.findAll(filters, limit, page);
  }
}
