import {App} from '../../../domain/entities';
import {IAppRepository} from '../../../domain/repositories';

export class GetOneApp {
  private repository: IAppRepository;

  constructor(repository: IAppRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<App> {
    return await this.repository.findById(id);
  }
}
