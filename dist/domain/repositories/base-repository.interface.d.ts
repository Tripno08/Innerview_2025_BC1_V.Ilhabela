export interface IBaseRepository<T, ID = string> {
    findAll(): Promise<T[]>;
    findById(id: ID): Promise<T | null>;
    create(data: any): Promise<T>;
    update(id: ID, data: any): Promise<T>;
    delete(id: ID): Promise<void>;
}
