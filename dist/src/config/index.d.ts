declare const config: {
    server: {
        port: number;
        apiPrefix: string;
        environment: "development" | "test" | "production";
    };
    database: {
        url: string;
    };
    redis: {
        url: string;
        cacheTtl: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    session: {
        secret: string;
    };
    cors: {
        origins: string[];
    };
    logger: {
        level: "error" | "warn" | "info" | "http" | "debug";
        format: "pretty" | "json";
    };
};
export default config;
