export interface AuthToken {
  sub: string;
  iat: number;
  exp: number;
  roles?: string[];
  permissions?: string[];
}
