import {App, IApp} from '../../../domain/entities';
import {IAppRepository} from '../../../domain/repositories';

export class CreateApp {
  private repository: IAppRepository;

  constructor(repository: IAppRepository){
    this.repository = repository;
  }

  public async execute(app: IApp): Promise<App> {
    return await this.repository.create(app);
  }
}
