export declare const testConfig: {
    database: {
        url: string;
    };
    redis: {
        host: string;
        port: number;
        keyPrefix: string;
    };
    storage: {
        tmpFolder: string;
        uploadsFolder: string;
    };
    auth: {
        secret: string;
        expiresIn: string;
    };
};
