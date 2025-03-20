-- AlterTable
ALTER TABLE `participantes_reuniao` ADD COLUMN `confirmado` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `reunioes` ADD COLUMN `pauta` TEXT NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `avatar` VARCHAR(191) NULL,
    MODIFY `cargo` ENUM('ADMIN', 'PROFESSOR', 'ESPECIALISTA', 'COORDENADOR', 'DIRETOR', 'ADMINISTRADOR') NOT NULL DEFAULT 'PROFESSOR';

-- CreateTable
CREATE TABLE `credenciais` (
    `id` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `salt` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `credenciais_usuarioId_key`(`usuarioId`),
    INDEX `credenciais_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `credenciais` ADD CONSTRAINT `credenciais_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
