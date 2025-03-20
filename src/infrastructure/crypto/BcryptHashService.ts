import { hash, compare } from 'bcryptjs';
import { injectable } from 'tsyringe';
import { IHashService } from '@domain/interfaces/IHashService';

@injectable()
export class BcryptHashService implements IHashService {
  private readonly SALT_ROUNDS = 10;

  public async hashPassword(password: string): Promise<string> {
    return hash(password, this.SALT_ROUNDS);
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
