import { Router } from 'express';
import { EstudanteController } from '@interfaces/controllers/estudante.controller';
import { authMiddleware } from '@interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '@interfaces/middlewares/rbac.middleware';
import { CargoUsuario } from '@shared/enums';

const estudanteRoutes = Router();
const estudanteController = new EstudanteController();

// Todas as rotas de estudante requerem autenticação
estudanteRoutes.use(authMiddleware);

// Listar estudantes do professor logado
estudanteRoutes.get('/', estudanteController.listarEstudantesProfessor);

// Cadastrar novo estudante
estudanteRoutes.post('/', estudanteController.cadastrar);

// Associar dificuldade a um estudante
estudanteRoutes.post(
  '/dificuldade',
  rbacMiddleware([
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.COORDENADOR,
    CargoUsuario.ADMINISTRADOR,
  ]),
  estudanteController.associarDificuldade,
);

// Registrar avaliação
estudanteRoutes.post(
  '/avaliacao',
  rbacMiddleware([
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.COORDENADOR,
    CargoUsuario.ADMINISTRADOR,
  ]),
  estudanteController.registrarAvaliacao,
);

// Recomendar intervenções
estudanteRoutes.get(
  '/:estudanteId/intervencoes/recomendacoes',
  rbacMiddleware([
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.COORDENADOR,
    CargoUsuario.ADMINISTRADOR,
  ]),
  estudanteController.recomendarIntervencoes,
);

// Acompanhar progresso
estudanteRoutes.get(
  '/:estudanteId/progresso',
  rbacMiddleware([
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.COORDENADOR,
    CargoUsuario.ADMINISTRADOR,
  ]),
  estudanteController.acompanharProgresso,
);

export { estudanteRoutes };
