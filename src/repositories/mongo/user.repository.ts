import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {IUser, User} from '../../domain/entities';
import {IUserRepository} from '../../domain/repositories';
import {UserMongoModel} from './schemas/user.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/sara',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class UserRepository implements IUserRepository {
  async create(user: IUser): Promise<User> {
    const userCreated = await UserMongoModel.create(user);
    return new User(userCreated.toJson());
  }

  async findAll(filters: any, limit: number, page: number): Promise<User[]> {
    return (await UserMongoModel
      .find(filters)
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new User(data));
  }

  async findById(id: string): Promise<User> {
    const data = await UserMongoModel
      .findById(id)
      .orFail(new HttpErrors[404]('User not found'));

    return new User(data);
  }

  async updateById(id: string, userToUpdate: Partial<User>): Promise<User> {
    const data = await UserMongoModel
      .findByIdAndUpdate(id, userToUpdate, {new: true})
      .orFail(new HttpErrors[404]('User not found'));

    return new User(data);
  }

  async replaceById(id: string, userToUpdate: User): Promise<User> {
    const data = await UserMongoModel
      .findOneAndReplace({_id: id}, userToUpdate, {new: true})
      .orFail(new HttpErrors[404]('User not found'));

    return new User(data);
  }

  async deleteById(id: string): Promise<void> {
    await UserMongoModel.findByIdAndDelete(id);
  }

}
