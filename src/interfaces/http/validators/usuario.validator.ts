import { z } from 'zod';
import { CargoUsuario } from '@prisma/client';

/**
 * Validador para criação de usuário
 */
export const criarUsuarioSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido').max(255, 'Email deve ter no máximo 255 caracteres'),
  senha: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  cargo: z.nativeEnum(CargoUsuario).optional().default(CargoUsuario.PROFESSOR),
});

/**
 * Validador para atualização de usuário
 */
export const atualizarUsuarioSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .optional(),
  senha: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .optional(),
  cargo: z.nativeEnum(CargoUsuario).optional(),
});

/**
 * Validador para login de usuário
 */
export const loginUsuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

/**
 * Tipo para criação de usuário
 */
export type CriarUsuarioDTO = z.infer<typeof criarUsuarioSchema>;

/**
 * Tipo para atualização de usuário
 */
export type AtualizarUsuarioDTO = z.infer<typeof atualizarUsuarioSchema>;

/**
 * Tipo para login de usuário
 */
export type LoginUsuarioDTO = z.infer<typeof loginUsuarioSchema>;
