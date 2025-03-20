export interface AuthTokenPayload {
    sub: string;
    email: string;
    cargo: string;
    iat?: number;
    exp?: number;
    [key: string]: string | number | undefined;
}
export interface TokenService {
    generateToken(payload: AuthTokenPayload): string;
    verifyToken(token: string): AuthTokenPayload;
    extractTokenFromHeader(authorizationHeader?: string): string;
}
