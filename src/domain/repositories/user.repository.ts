import {IUser, User} from '../entities';

export interface IUserRepository {
  create(user: IUser): Promise<User>
  findAll(filters: any, limit: number, page: number): Promise<User[]>
  findById(id: string): Promise<User>
  updateById(id: string, userToUpdate: Partial<User>): Promise<User>
  replaceById(id: string, userToUpdate: User): Promise<User>
  deleteById(id: string): Promise<void>
}
