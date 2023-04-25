import {IInvitation, Invitation} from '../../../domain/entities';
import {IInvitationRepository} from '../../../domain/repositories';

export class ReplaceInvitation {
  private repository: IInvitationRepository;

  constructor(repository: IInvitationRepository){
    this.repository = repository;
  }

  public async execute(id: string, app: IInvitation): Promise<Invitation> {
    return await this.repository.replaceById(id, app);
  }
}
