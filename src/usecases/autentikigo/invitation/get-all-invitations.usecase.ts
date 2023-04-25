import {Invitation} from '../../../domain/entities';
import {IInvitationRepository} from '../../../domain/repositories';

export class GetAllInvitations {
  private repository: IInvitationRepository;

  constructor(repository: IInvitationRepository){
    this.repository = repository;
  }

  public async execute(filters: any, limit: number, page: number): Promise<Invitation[]> {
    return await this.repository.findAll(filters, limit, page);
  }
}
