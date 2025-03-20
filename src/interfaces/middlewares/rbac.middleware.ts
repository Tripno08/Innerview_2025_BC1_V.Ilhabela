import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CargoUsuario } from '../../shared/enums';
import { AppError } from '../../shared/errors/app-error';
import { VerificarPermissaoUseCase } from '../../application/use-cases/usuario/verificar-permissao.use-case';

/**
 * Middleware para verificar permissões de acordo com cargo do usuário
 */
export function rbacMiddleware(cargosPermitidos: CargoUsuario[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED');
    }

    try {
      const verificarPermissaoUseCase = container.resolve<VerificarPermissaoUseCase>(
        'VerificarPermissaoUseCase',
      );

      // Verificar permissão considerando instituição se for passada
      const instituicaoId = req.params.instituicaoId || req.body.instituicaoId;

      const temPermissao = await verificarPermissaoUseCase.execute({
        usuarioId: req.user.id,
        instituicaoId,
        cargosPermitidos,
      });

      if (!temPermissao) {
        throw new AppError('Acesso não autorizado', 403, 'FORBIDDEN');
      }

      return next();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao verificar permissões', 500, 'PERMISSION_ERROR');
    }
  };
}
