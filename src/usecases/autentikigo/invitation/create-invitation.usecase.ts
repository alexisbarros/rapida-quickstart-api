import {IInvitation, Invitation} from '../../../domain/entities';
import {IInvitationRepository} from '../../../domain/repositories';

export class CreateInvivation {
  private repository: IInvitationRepository;

  constructor(repository: IInvitationRepository){
    this.repository = repository;
  }

  public async execute(invitation: IInvitation): Promise<Invitation> {
    return await this.repository.create(invitation);
  }
}
