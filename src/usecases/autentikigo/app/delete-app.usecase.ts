import {IAppRepository} from '../../../domain/repositories';

export class DeleteApp {
  private repository: IAppRepository;

  constructor(repository: IAppRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<void> {
    return await this.repository.deleteById(id);
  }
}
