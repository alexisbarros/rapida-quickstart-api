import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {IPerson, Person} from '../../../domain/entities';
import {IPersonRepository} from '../../../domain/repositories';
import {getPopulateObjFromSchema} from '../../../utils/general.util';
import {PersonMongoModel} from './schemas/person.schema';
import {userSchema} from './schemas/user.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/kunlatek',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class PersonRepository implements IPersonRepository {
  async create(person: IPerson): Promise<Person> {
    const personCreated = await PersonMongoModel.create(person);
    return new Person(personCreated.toJson());
  }

  async findAll(filters: any, limit: number, page: number): Promise<Person[]> {
    return (await PersonMongoModel
      .find(filters)
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new Person(data));
  }

  async findById(id: string): Promise<Person> {
    const data = await PersonMongoModel
      .findById(id)
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .orFail(new HttpErrors[404]('Person not found'));

    return new Person(data);
  }

  async updateById(id: string, personToUpdate: Partial<Person>): Promise<Person> {
    const data = await PersonMongoModel
      .findByIdAndUpdate(id, personToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .orFail(new HttpErrors[404]('Person not found'));

    return new Person(data);
  }

  async replaceById(id: string, personToUpdate: Person): Promise<Person> {
    const data = await PersonMongoModel
      .findOneAndReplace({_id: id}, personToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .orFail(new HttpErrors[404]('Person not found'));

    return new Person(data);
  }

  async deleteById(id: string): Promise<void> {
    await PersonMongoModel.findByIdAndDelete(id);
  }

}
