import { Router } from 'express';
import { UsuarioController } from '@interfaces/controllers/usuario.controller';
import { authMiddleware } from '@interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '@interfaces/middlewares/rbac.middleware';
import { CargoUsuario } from '@shared/enums';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

// Rotas públicas
usuarioRoutes.post('/registrar', usuarioController.registrar);
usuarioRoutes.post('/autenticar', usuarioController.autenticar);

// Rotas protegidas que requerem autenticação
usuarioRoutes.use(authMiddleware);
usuarioRoutes.get('/perfil', usuarioController.obterPerfil);
usuarioRoutes.put('/perfil', usuarioController.atualizarPerfil);

// Rotas que requerem permissões específicas
usuarioRoutes.post(
  '/instituicao',
  rbacMiddleware([CargoUsuario.ADMINISTRADOR, CargoUsuario.DIRETOR, CargoUsuario.COORDENADOR]),
  usuarioController.associarAInstituicao,
);

export { usuarioRoutes };
