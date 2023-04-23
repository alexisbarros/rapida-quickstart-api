import {GetPersonDataFromApi} from '.';
import {User} from '../../../domain/entities';
import {IPersonRepository, IUserRepository} from '../../../domain/repositories';
import {IJwtPayload} from '../../../interfaces/jwt.interface';
import {theDatesMatch} from '../../../utils/date-manipulation-functions';
import {VerifyJwt} from '../jwt';
import {GetPersonByUniqueId} from '../person';

export class SignupPerson {

  private personRepository: IPersonRepository;
  private userRepository: IUserRepository;

  constructor(
    personRepository: IPersonRepository,
    userRepository: IUserRepository,
  ){
    this.personRepository = personRepository;
    this.userRepository = userRepository;
  }

  public async execute(uniqueId: string, birthday: number, token?: string): Promise<string> {
    if(!token) throw new Error('Token must be provided');
    let payload: IJwtPayload;
    try { payload = new VerifyJwt().execute(token) }
    catch(err) { return 'noAuthorized' }

    const person = (
      await new GetPersonByUniqueId(this.personRepository).execute(uniqueId) ??
      await new GetPersonDataFromApi(this.personRepository).execute(uniqueId)
    )

    if(!theDatesMatch(person.birthday!, birthday))
      throw new Error('Birthday incorrect');

    const userToCreate = new User({ ...payload });
    const userCreated = await this.userRepository.create(userToCreate);

    await this.personRepository.updateById(person._id!, { userId: userCreated._id! });

    return userCreated._id!;
  }

}
