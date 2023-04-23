import {IModuleRepository} from '../../../domain/repositories';

export class DeleteModule {
  private repository: IModuleRepository;

  constructor(repository: IModuleRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<void> {
    return await this.repository.deleteById(id);
  }
}
