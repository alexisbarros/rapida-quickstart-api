import {HttpErrors} from '@loopback/rest';
import {Person} from '../../../domain/entities';
import {IPersonRepository} from '../../../domain/repositories';

export class GetPersonDataFromUser {

  private repository: IPersonRepository;

  constructor(repository: IPersonRepository){
    this.repository = repository;
  }

  public async execute(userId: string): Promise<Person> {
    const personFound = await this.repository.findAll({ userId }, 1, 0);
    if(!personFound.length) throw new HttpErrors[404]('Person not found');
    return personFound[0];
  }
}
