import {IInvitationRepository} from '../../../domain/repositories';

export class DeleteInvitation {
  private repository: IInvitationRepository;

  constructor(repository: IInvitationRepository){
    this.repository = repository;
  }

  public async execute(id: string): Promise<void> {
    return await this.repository.deleteById(id);
  }
}
