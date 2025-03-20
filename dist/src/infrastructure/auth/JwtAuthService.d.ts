import { AuthTokenPayload, TokenService } from '../../domain/services/token-service';
export declare class JwtAuthService implements TokenService {
    generateToken(payload: AuthTokenPayload): string;
    verifyToken(token: string): AuthTokenPayload;
    extractTokenFromHeader(authorizationHeader?: string): string;
}
