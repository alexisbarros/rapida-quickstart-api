import {GetPersonDataFromApi} from '.';
import {IUser, Permission, User} from '../../../domain/entities';
import {IInvitationRepository, IPermissionRepository, IPersonRepository, IUserRepository} from '../../../domain/repositories';
import {IJwtPayload} from '../../../interfaces/jwt.interface';
import {theDatesMatch} from '../../../utils/date-manipulation-functions';
import {hideEmailString} from '../../../utils/string-manipulation-functions';
import {VerifyJwt} from '../jwt';
import {GetPersonByUniqueId} from '../person';

export class SignupPerson {

  private personRepository: IPersonRepository;
  private userRepository: IUserRepository;

  private invitationRepository: IInvitationRepository;
  private permissionRepository: IPermissionRepository;

  constructor(
    personRepository: IPersonRepository,
    userRepository: IUserRepository,
    invitationRepository: IInvitationRepository,
    permissionRepository: IPermissionRepository,
  ){
    this.personRepository = personRepository;
    this.userRepository = userRepository;
    this.invitationRepository = invitationRepository;
    this.permissionRepository = permissionRepository;
  }

  public async execute(uniqueId: string, birthday: number, token?: string): Promise<string> {
    let payload: IJwtPayload;
    try { payload = new VerifyJwt().execute(token) }
    catch(err) { return 'noAuthorized' }

    const person = (
      await new GetPersonByUniqueId(this.personRepository).execute(uniqueId) ??
      await new GetPersonDataFromApi(this.personRepository).execute(uniqueId)
    );

    if(person.userId)
      throw new Error(`The unique id is already being used by ${hideEmailString((person.userId as IUser).email ?? '')}`);

    if(!theDatesMatch(person.birthday!, birthday))
      throw new Error('Birthday incorrect');

    const userToCreate = new User({ ...payload });
    const userCreated = await this.userRepository.create(userToCreate);

    if(payload.invitationId){
      const invitation = await this.invitationRepository.findById(payload.invitationId);
      await this.permissionRepository
        .create(new Permission({
          user: userCreated._id!,
          permissionGroup: (invitation.permissionGroup as string),
          _createdBy: userCreated._id!,
          _ownerId: invitation._ownerId ?? invitation._createdBy,
        }));
    }

    await this.personRepository.updateById(person._id!, { userId: userCreated._id! });

    return userCreated._id!;
  }

}
