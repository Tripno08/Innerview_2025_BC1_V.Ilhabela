// Estendendo a interface Request do Express
import { CargoUsuario } from '@prisma/client';

declare global {
  namespace Express {
    // Estendendo a interface Request para incluir usuário autenticado
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
}
