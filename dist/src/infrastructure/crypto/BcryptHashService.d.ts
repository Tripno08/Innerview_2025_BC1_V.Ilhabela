import { IHashService } from '@domain/interfaces/IHashService';
export declare class BcryptHashService implements IHashService {
    private readonly SALT_ROUNDS;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
