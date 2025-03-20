import { IHashService } from '@application/interfaces/cryptography.interface';
export declare class BcryptHashService implements IHashService {
    private readonly saltRounds;
    constructor(saltRounds?: number);
    hash(data: string): Promise<string>;
    compare(plaintext: string, hash: string): Promise<boolean>;
}
