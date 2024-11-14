import { Pool, PoolClient, QueryResult } from 'pg';
class DBClient {
    private static instance: DBClient;
    private pool: Pool;
    private client: PoolClient | null = null;

    private constructor(dbname: string, user: string, password: string, host: string, port: number, minconn: number, maxconn: number) {
        this.pool = new Pool({
            user: user,
            host: host,
            database: dbname,
            password: password,
            port: port,
            min: 10,
            max: 100,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 1000
        });
    }

    public static getInstance(dbname: string, user: string, password: string, host: string, port: number, minconn: number, maxconn: number): DBClient {
        if (!DBClient.instance) DBClient.instance = new DBClient(dbname, user, password, host, port, minconn, maxconn);
        return DBClient.instance;
    }

    public async initializeConnection() {
        try {
            if (!this.client) {
                this.client = await this.pool.connect();
                console.log('Live connection established');
            }
        } catch (error) {
            console.error('Error establishing live connection:', error);
        }
    }
    public async executeQuery(query: string, params?: any[]): Promise<QueryResult | null> {
        if (!this.client) {
            console.error('No live connection available');
            return null;
        }
        try {
            const res = await this.client.query(query, params);
            return res;
        } catch (error) {
            console.error('Error executing query with live connection:', error);
            return null;
        }
    }

    public async closePool(): Promise<void> {
        await this.pool.end();
        console.log('Connection pool closed');
    }
}
export {DBClient};