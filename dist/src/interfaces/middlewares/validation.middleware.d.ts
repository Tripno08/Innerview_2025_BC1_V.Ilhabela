import { Request, Response, NextFunction } from 'express';
import { Joi } from 'celebrate';
export declare const ValidationMiddleware: {
    validateBody: (schema: Joi.ObjectSchema) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    validateParams: (schema: Joi.ObjectSchema | Record<string, Joi.ObjectSchema>) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    validateQuery: (schema: Joi.ObjectSchema) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    handleValidationErrors: (err: Error & {
        joi?: {
            details: Array<{
                message: string;
                path: string[];
                type: string;
            }>;
        };
    }, req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
    schemas: {
        id: Joi.ObjectSchema<any>;
        pagination: Joi.ObjectSchema<any>;
        periodo: Joi.ObjectSchema<any>;
        usuario: {
            registro: Joi.ObjectSchema<any>;
            autenticacao: Joi.ObjectSchema<any>;
            atualizacao: Joi.ObjectSchema<any>;
        };
        estudante: {
            criacao: Joi.ObjectSchema<any>;
        };
        intervencao: {
            criacao: Joi.ObjectSchema<any>;
            progresso: Joi.ObjectSchema<any>;
        };
        equipe: {
            criacao: Joi.ObjectSchema<any>;
            membro: Joi.ObjectSchema<any>;
        };
        reuniao: {
            criacao: Joi.ObjectSchema<any>;
        };
        dificuldade: {
            criacao: Joi.ObjectSchema<any>;
            associacao: Joi.ObjectSchema<any>;
        };
    };
};
