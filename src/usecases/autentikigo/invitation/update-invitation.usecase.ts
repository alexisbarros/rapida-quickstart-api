import {IInvitation, Invitation} from '../../../domain/entities';
import {IInvitationRepository} from '../../../domain/repositories';

export class UpdateInvitation {
  private repository: IInvitationRepository;

  constructor(repository: IInvitationRepository){
    this.repository = repository;
  }

  public async execute(id: string, app: Partial<IInvitation>): Promise<Invitation> {
    return await this.repository.updateById(id, app);
  }
}
