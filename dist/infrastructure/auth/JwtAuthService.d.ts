import { IAuthService } from '@domain/interfaces/IAuthService';
import { AuthToken } from '@domain/types/AuthToken';
export declare class JwtAuthService implements IAuthService {
    generateToken(payload: object): string;
    verifyToken(token: string): AuthToken;
    extractTokenFromHeader(authorization?: string): string;
}
