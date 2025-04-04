// Estendendo a interface Request do Express
import { CargoUsuario } from '../shared/enums';

// Extendendo o namespace Express para incluir usuário autenticado em todos os requests
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
