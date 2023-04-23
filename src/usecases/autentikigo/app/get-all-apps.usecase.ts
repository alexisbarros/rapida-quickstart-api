import {App} from '../../../domain/entities';
import {IAppRepository} from '../../../domain/repositories';

export class GetAllApps {
  private repository: IAppRepository;

  constructor(repository: IAppRepository){
    this.repository = repository;
  }

  public async execute(filters: any, limit: number, page: number): Promise<App[]> {
    return await this.repository.findAll(filters, limit, page);
  }
}
