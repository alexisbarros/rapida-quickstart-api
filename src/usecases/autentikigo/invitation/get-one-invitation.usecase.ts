import {Invitation} from '../../../domain/entities';
import {IInvitationRepository} from '../../../domain/repositories';

export class GetOneInvitation {
  private repository: IInvitationRepository;

  constructor(repository: IInvitationRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<Invitation> {
    return await this.repository.findById(id);
  }
}
