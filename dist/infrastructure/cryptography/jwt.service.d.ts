import { IJwtService } from '@application/interfaces/cryptography.interface';
export declare class JwtService implements IJwtService {
    sign(payload: any, options?: any): string;
    verify<T = any>(token: string): T;
}
