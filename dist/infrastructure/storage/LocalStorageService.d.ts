import { IStorageService } from '@domain/interfaces/IStorageService';
export declare class LocalStorageService implements IStorageService {
    private tmpFolder;
    private uploadsFolder;
    constructor();
    private ensureDirectoriesExist;
    saveFile(file: Express.Multer.File): Promise<string>;
    deleteFile(fileName: string): Promise<void>;
    getFileUrl(fileName: string): string;
}
