import { Router } from 'express';
import { UsuarioController } from '@interfaces/http/controllers/usuario.controller';
import { authMiddleware } from '@interfaces/http/middlewares/auth-middleware';

const usuarioRoutes = Router();
const usuarioController = new UsuarioController();

// Rotas públicas
usuarioRoutes.post('/login', (req, res) => usuarioController.login(req, res));
usuarioRoutes.post('/refresh-token', (req, res) => usuarioController.refreshToken(req, res));

// Rotas protegidas
usuarioRoutes.use(authMiddleware);
usuarioRoutes.get('/', (req, res) => usuarioController.findAll(req, res));
usuarioRoutes.get('/:id', (req, res) => usuarioController.findById(req, res));
usuarioRoutes.post('/', (req, res) => usuarioController.create(req, res));
usuarioRoutes.put('/:id', (req, res) => usuarioController.update(req, res));
usuarioRoutes.delete('/:id', (req, res) => usuarioController.delete(req, res));

export { usuarioRoutes };
