import {IUser, User} from '../../entities';

export interface IUserRepository {
  create(user: IUser): Promise<User>
  findAll(filters: any, limit: number, page: number): Promise<User[]>
  findById(id: string): Promise<User>
  updateById(id: string, userToUpdate: Partial<IUser>): Promise<User>
  replaceById(id: string, userToUpdate: IUser): Promise<User>
  deleteById(id: string): Promise<void>
}
