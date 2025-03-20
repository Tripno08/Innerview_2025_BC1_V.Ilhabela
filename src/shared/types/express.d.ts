import { CargoUsuario } from './cargo.enum';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        cargo: CargoUsuario;
      };
    }
  }
}
