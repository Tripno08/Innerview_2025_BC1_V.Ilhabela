-- Configurar permissões para o usuário
GRANT ALL PRIVILEGES ON innerview_ilhabela.* TO 'user'@'%';
FLUSH PRIVILEGES;

-- Configurar UTF8MB4 para suporte a caracteres especiais
ALTER DATABASE innerview_ilhabela CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 