import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { usuarioRoutes } from './usuario.routes';
import reuniaoRouter from './reuniao.routes';

const router = Router();

// Rotas de verificação de saúde do sistema
router.use('/health', healthRoutes);

// Rotas de gerenciamento de usuários
router.use('/usuarios', usuarioRoutes);

// Rotas de gerenciamento de reuniões
router.use('/reunioes', reuniaoRouter);

// Aqui serão adicionadas as demais rotas da aplicação
// router.use('/estudantes', estudanteRoutes);
// router.use('/avaliacoes', avaliacaoRoutes);
// etc...

export { router };
