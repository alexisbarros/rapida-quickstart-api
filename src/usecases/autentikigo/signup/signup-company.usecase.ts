import {GetCompanyDataFromApi} from '.';
import {ICompany, User} from '../../../domain/entities';
import {ICompanyRepository, IUserRepository} from '../../../domain/repositories';
import {IJwtPayload} from '../../../interfaces/jwt.interface';
import {theDatesMatch} from '../../../utils/date-manipulation-functions';
import {hideEmailString} from '../../../utils/string-manipulation-functions';
import {GetCompanyByUniqueId} from '../company/get-company-by-unique-id.usecase';
import {VerifyJwt} from '../jwt';

export class SignupCompany {

  private companyRepository: ICompanyRepository;
  private userRepository: IUserRepository;

  constructor(
    personRepository: ICompanyRepository,
    userRepository: IUserRepository,
  ){
    this.companyRepository = personRepository;
    this.userRepository = userRepository;
  }

  public async execute(uniqueId: string, birthday: number, token?: string): Promise<string> {
    let payload: IJwtPayload;
    try { payload = new VerifyJwt().execute(token) }
    catch(err) { return 'noAuthorized' }

    const company = (
      await new GetCompanyByUniqueId(this.companyRepository).execute(uniqueId) ??
      await new GetCompanyDataFromApi(this.companyRepository).execute(uniqueId)
    );

    if(company.userId)
      throw new Error(`The unique id is already being used by ${hideEmailString((company.userId as ICompany).email ?? '')}`);

    if(!theDatesMatch(company.birthday!, birthday))
      throw new Error('Birthday incorrect');

    const userToCreate = new User({ ...payload });
    const userCreated = await this.userRepository.create(userToCreate);

    await this.companyRepository.updateById(company._id!, { userId: userCreated._id! });

    return userCreated._id!;
  }

}
