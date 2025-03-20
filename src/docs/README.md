# Documentação da API - Innerview Ilhabela

Esta pasta contém a configuração e os arquivos da documentação Swagger/OpenAPI da API do sistema Innerview Ilhabela.

## Acessando a Documentação

A documentação está disponível nas seguintes rotas:

- **Interface Swagger UI**: `/api-docs`
- **Especificação OpenAPI em JSON**: `/api-docs.json`

## Autenticação na Documentação

Em ambiente de produção, o acesso à documentação é protegido por autenticação básica:

- **Usuário padrão**: `admin`
- **Senha padrão**: `innerview`

Estas credenciais podem ser alteradas através das variáveis de ambiente:
- `SWAGGER_USERNAME`
- `SWAGGER_PASSWORD`

## Estrutura dos Arquivos

- `swagger.ts` - Configuração principal e definição do schema OpenAPI
- `setup.ts` - Configuração e inicialização do Swagger na aplicação
- `routes/*.yaml` - Documentação detalhada das rotas organizadas por entidade

## Como Documentar Novos Endpoints

### Opção 1: Usando Arquivos YAML

Crie um novo arquivo `.yaml` em `src/docs/routes/` seguindo o formato dos arquivos existentes.

### Opção 2: Usando Anotações JSDoc

Documente diretamente nos controladores usando anotações JSDoc com o prefixo `@swagger`.

Exemplo:

```typescript
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
async listar(req: Request, res: Response): Promise<Response> {
  // Implementação
}
```

## Testando Requisições

A UI do Swagger permite testar as requisições diretamente pela interface:

1. Clique em "Authorize" e informe o token JWT para autenticar
2. Selecione o endpoint desejado e clique em "Try it out"
3. Preencha os parâmetros necessários e execute a requisição

## Autenticação para Testar Endpoints Protegidos

1. Primeiro, faça login usando o endpoint `/usuarios/autenticacao`
2. Copie o token JWT retornado na resposta
3. Clique no botão "Authorize" no topo da página
4. No campo "Value", digite `Bearer {seu-token}` (substitua {seu-token} pelo token copiado)
5. Clique em "Authorize" e depois em "Close"

Agora você pode testar os endpoints protegidos. 