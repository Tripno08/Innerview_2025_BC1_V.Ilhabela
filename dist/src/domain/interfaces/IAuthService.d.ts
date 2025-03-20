import { AuthToken } from '../types/AuthToken';
export interface IAuthService {
    generateToken(payload: object): string;
    verifyToken(token: string): AuthToken;
    extractTokenFromHeader(authorization?: string): string;
}
