import {Person} from '../../../domain/entities';
import {IPersonRepository} from '../../../domain/repositories';
import {GetPersonDataFromAPI} from '../../../services';

export class GetPersonDataFromApi {

  private repository: IPersonRepository;

  constructor(personRepository: IPersonRepository){
    this.repository = personRepository;
  }

  public async execute(uniqueId: string): Promise<Person> {
    const person = await new GetPersonDataFromAPI().execute(uniqueId);
    return await this.repository.create(person);
  }

}
