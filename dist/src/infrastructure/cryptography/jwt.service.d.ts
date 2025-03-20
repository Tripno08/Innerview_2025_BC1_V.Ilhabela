import { IJwtService } from '@application/interfaces/cryptography.interface';
import type { StringValue } from 'ms';
export declare class JwtService implements IJwtService {
    sign(payload: Record<string, unknown>, options?: {
        expiresIn?: StringValue | number;
        subject?: string;
        issuer?: string;
    }): string;
    verify<T extends Record<string, unknown> = Record<string, unknown>>(token: string): T;
}
