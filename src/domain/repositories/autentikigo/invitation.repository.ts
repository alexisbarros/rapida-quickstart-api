import {IInvitation, Invitation} from '../../entities'

export interface IInvitationRepository {
  create(invitation: IInvitation): Promise<Invitation>
  findAll(filters: any, limit: number, page: number): Promise<Invitation[]>
  findById(id: string): Promise<Invitation>
  updateById(id: string, invitationToUpdate: Partial<IInvitation>): Promise<Invitation>
  replaceById(id: string, invitationToUpdate: IInvitation): Promise<Invitation>
  deleteById(id: string): Promise<void>
}
