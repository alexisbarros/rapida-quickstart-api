import {App, IApp} from '../../../domain/entities';
import {IAppRepository} from '../../../domain/repositories';

export class UpdateApp {
  private repository: IAppRepository;

  constructor(repository: IAppRepository){
    this.repository = repository;
  }

  public async execute(id: string, app: Partial<IApp>): Promise<App> {
    return await this.repository.updateById(id, app);
  }
}
