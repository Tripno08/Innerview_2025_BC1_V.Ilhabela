import fs from 'fs';
import path from 'path';
import { injectable } from 'tsyringe';
import { IStorageService } from '@domain/interfaces/IStorageService';
import { AppError } from '@shared/errors/AppError';
import { config } from '@config/storage';

@injectable()
export class LocalStorageService implements IStorageService {
  private tmpFolder: string;
  private uploadsFolder: string;

  constructor() {
    this.tmpFolder = config.storage.tmpFolder;
    this.uploadsFolder = config.storage.uploadsFolder;

    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    if (!fs.existsSync(this.tmpFolder)) {
      fs.mkdirSync(this.tmpFolder, { recursive: true });
    }
    if (!fs.existsSync(this.uploadsFolder)) {
      fs.mkdirSync(this.uploadsFolder, { recursive: true });
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new AppError('Arquivo não fornecido');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.resolve(this.uploadsFolder, fileName);

    await fs.promises.rename(file.path, filePath);

    return fileName;
  }

  public async deleteFile(fileName: string): Promise<void> {
    const filePath = path.resolve(this.uploadsFolder, fileName);

    try {
      await fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
    } catch {
      // Arquivo não existe, ignorar erro
    }
  }

  public getFileUrl(fileName: string): string {
    return `${config.storage.baseUrl}/uploads/${fileName}`;
  }
}
