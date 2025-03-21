import { z } from 'zod';
export declare const criarUsuarioSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    senha: z.ZodString;
    cargo: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<{
        ADMIN: "ADMIN";
        PROFESSOR: "PROFESSOR";
        ESPECIALISTA: "ESPECIALISTA";
        COORDENADOR: "COORDENADOR";
        DIRETOR: "DIRETOR";
        ADMINISTRADOR: "ADMINISTRADOR";
    }>>>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    cargo?: "ADMIN" | "PROFESSOR" | "ESPECIALISTA" | "COORDENADOR" | "DIRETOR" | "ADMINISTRADOR";
    nome?: string;
    senha?: string;
}, {
    email?: string;
    cargo?: "ADMIN" | "PROFESSOR" | "ESPECIALISTA" | "COORDENADOR" | "DIRETOR" | "ADMINISTRADOR";
    nome?: string;
    senha?: string;
}>;
export declare const atualizarUsuarioSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    senha: z.ZodOptional<z.ZodString>;
    cargo: z.ZodOptional<z.ZodNativeEnum<{
        ADMIN: "ADMIN";
        PROFESSOR: "PROFESSOR";
        ESPECIALISTA: "ESPECIALISTA";
        COORDENADOR: "COORDENADOR";
        DIRETOR: "DIRETOR";
        ADMINISTRADOR: "ADMINISTRADOR";
    }>>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    cargo?: "ADMIN" | "PROFESSOR" | "ESPECIALISTA" | "COORDENADOR" | "DIRETOR" | "ADMINISTRADOR";
    nome?: string;
    senha?: string;
}, {
    email?: string;
    cargo?: "ADMIN" | "PROFESSOR" | "ESPECIALISTA" | "COORDENADOR" | "DIRETOR" | "ADMINISTRADOR";
    nome?: string;
    senha?: string;
}>;
export declare const loginUsuarioSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    senha?: string;
}, {
    email?: string;
    senha?: string;
}>;
export type CriarUsuarioDTO = z.infer<typeof criarUsuarioSchema>;
export type AtualizarUsuarioDTO = z.infer<typeof atualizarUsuarioSchema>;
export type LoginUsuarioDTO = z.infer<typeof loginUsuarioSchema>;
