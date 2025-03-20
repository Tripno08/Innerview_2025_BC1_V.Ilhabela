export interface IStorageService {
    saveFile(file: Express.Multer.File): Promise<string>;
    deleteFile(fileName: string): Promise<void>;
    getFileUrl(fileName: string): string;
}
