export interface IBaseRepository<T, ID = string> {
    findAll(): Promise<T[]>;
    findById(id: ID): Promise<T | null>;
    create(data: Partial<Omit<T, 'id'>>): Promise<T>;
    update(id: ID, data: Partial<Omit<T, 'id'>>): Promise<T>;
    delete(id: ID): Promise<void>;
}
