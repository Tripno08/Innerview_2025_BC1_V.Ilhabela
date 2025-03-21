// Estendendo a interface Request do Express
import { CargoUsuario } from '../../shared/enums';

declare namespace Express {
  interface Request {
    user: {
      id: string;
      email: string;
      cargo: CargoUsuario;
      // Nome é opcional para compatibilidade com código existente
      nome?: string;
    };
  }
}
