import {Person} from '../../domain/entities';
import {IPersonRepository} from '../../domain/repositories';

export class GetPersonByUniqueId {

  private repository: IPersonRepository;

  constructor(personRepository: IPersonRepository){
    this.repository = personRepository;
  }

  public async execute(uniqueId: string): Promise<Person | null> {
    const persons = await this.repository.findAll({ uniqueId }, 1, 0);
    return persons.length > 0 ? persons[0] : null;
  }

}
