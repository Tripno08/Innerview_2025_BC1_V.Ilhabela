export interface IHashService {
    hash(data: string): Promise<string>;
    compare(plaintext: string, hash: string): Promise<boolean>;
}
export interface IJwtService {
    sign(payload: any, options?: any): string;
    verify<T = any>(token: string): T;
}
