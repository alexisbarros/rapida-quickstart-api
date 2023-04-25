import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {IInvitation, Invitation} from '../../../domain/entities';
import {IInvitationRepository} from '../../../domain/repositories';
import {InvitationMongoModel} from './schemas/invitation.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/kunlatek',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class InvitationRepository implements IInvitationRepository {
  async create(invitation: IInvitation): Promise<Invitation> {
    const permissionCreated = await InvitationMongoModel.create(invitation);
    return new Invitation(permissionCreated);
  }

  async findAll(filters: any, limit: number, page: number): Promise<Invitation[]> {
    return (await InvitationMongoModel
      .find(filters)
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new Invitation(data));
  }

  async findById(id: string): Promise<Invitation> {
    const data = await InvitationMongoModel
      .findById(id)
      .orFail(new HttpErrors[404]('Invitation not found'));

    return new Invitation(data);
  }

  async updateById(id: string, invitationToUpdate: Partial<IInvitation>): Promise<Invitation> {
    const data = await InvitationMongoModel
      .findByIdAndUpdate(id, invitationToUpdate, {new: true})
      .orFail(new HttpErrors[404]('Invitation not found'));

    return new Invitation(data);
  }

  async replaceById(id: string, invitationToUpdate: IInvitation): Promise<Invitation> {
    const data = await InvitationMongoModel
      .findOneAndReplace({_id: id}, invitationToUpdate, {new: true})
      .orFail(new HttpErrors[404]('Invitation not found'));

    return new Invitation(data);
  }

  async deleteById(id: string): Promise<void> {
    await InvitationMongoModel.findByIdAndDelete(id);
  }

}
