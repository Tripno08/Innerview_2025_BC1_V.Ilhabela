export interface IHashService {
    hash(data: string): Promise<string>;
    compare(plaintext: string, hash: string): Promise<boolean>;
}
export interface IJwtService {
    sign(payload: Record<string, unknown>, options?: {
        expiresIn?: string | number;
        subject?: string;
        issuer?: string;
    }): string;
    verify<T extends Record<string, unknown> = Record<string, unknown>>(token: string): T;
}
