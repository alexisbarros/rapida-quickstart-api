import {User} from '../../domain/entities';
import {IUserRepository} from '../../domain/repositories';

export class GetUserByEmail {

  private repository: IUserRepository;

  constructor(userRepository: IUserRepository){
    this.repository = userRepository;
  }

  public async execute(email: string): Promise<User | null> {
    const users = await this.repository.findAll({ email }, 1, 0);
    return users.length > 0 ? users[0] : null;
  }

}
