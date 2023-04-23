import {App, IApp} from '../../../domain/entities';
import {IAppRepository} from '../../../domain/repositories';

export class ReplaceApp {
  private repository: IAppRepository;

  constructor(repository: IAppRepository){
    this.repository = repository;
  }

  public async execute(id: string, app: IApp): Promise<App> {
    return await this.repository.replaceById(id, app);
  }
}
