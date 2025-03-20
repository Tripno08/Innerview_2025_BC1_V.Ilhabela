import { Router } from 'express';
import { HealthController } from '@interfaces/http/controllers/health.controller';

const healthRoutes = Router();
const healthController = new HealthController();

// Verificação básica de saúde
healthRoutes.get('/', (req, res) => healthController.check(req, res));

// Verificação detalhada incluindo banco de dados e outros serviços
healthRoutes.get('/details', (req, res) => healthController.details(req, res));

export { healthRoutes };
