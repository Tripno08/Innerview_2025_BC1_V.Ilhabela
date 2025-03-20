/**
 * Interface que define a estrutura do payload do token de autenticação
 */
export interface AuthTokenPayload {
  /** ID do usuário (subject) */
  sub: string;
  /** Email do usuário */
  email: string;
  /** Cargo do usuário */
  cargo: string;
  /** Timestamp de emissão do token */
  iat?: number;
  /** Timestamp de expiração do token */
  exp?: number;
  /** Permite propriedades adicionais com nome string e valor string ou número */
  [key: string]: string | number | undefined;
}

/**
 * Interface que define os serviços de token para autenticação
 */
export interface TokenService {
  /**
   * Gera um token para o payload fornecido
   * @param payload Os dados a serem incluídos no token
   * @returns O token gerado
   */
  generateToken(payload: AuthTokenPayload): string;

  /**
   * Verifica a validade de um token
   * @param token O token a ser verificado
   * @returns O payload contido no token se for válido
   */
  verifyToken(token: string): AuthTokenPayload;

  /**
   * Extrai o token do cabeçalho de autorização
   * @param authorizationHeader O cabeçalho de autorização
   * @returns O token extraído
   */
  extractTokenFromHeader(authorizationHeader?: string): string;
}
