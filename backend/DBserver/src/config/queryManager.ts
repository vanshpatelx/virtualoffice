import { QueryResult } from "pg";
import { DBClient } from "./DBClient";
import { query } from "./query";
import { config } from "./config";

class QueryManager {
    private static instance: QueryManager;
    private dbclient: DBClient;

    private constructor() {
        this.dbclient = DBClient.getInstance('your_db_name', 'your_db_user', 'your_db_password', 'localhost', 5000, 10, 100);

        // Each tables
        const userTable = query.createTable.users;
        const elementTable = query.createTable.elements;
        const avatarTable = query.createTable.avatars;
        const userSpaceTable = query.createTable.userSpace;
        this.dbclient.executeQuery(userTable);
        this.dbclient.executeQuery(elementTable);
        this.dbclient.executeQuery(avatarTable);
        this.dbclient.executeQuery(userSpaceTable);
    }

    public static getInstance(): QueryManager {
        if (!QueryManager.instance) {
            QueryManager.instance = new QueryManager();
        }
        return QueryManager.instance;
    }

    public async initializeConnection(): Promise<void> {
        await this.dbclient.initializeConnection();
    }

    public async fetchData(query: string, params: any[] = []): Promise<QueryResult | null> {
        return await this.dbclient.executeQuery(query, params);
    }

    public async userMessage(messageContent: string | undefined, partition: number) {
        if (!messageContent) {
            console.error('No message content provided');
            return;
        }
        try {
            const data = JSON.parse(messageContent);
            const { id, username, password, type } = data;

            if (!id || !username || !password || !type) {
                console.error('Invalid data provided:', data);
                return;
            }

            switch (partition) {
                case 1: // addUser
                    const result: QueryResult | null = await this.dbclient.executeQuery(query.insertQuery.addUser, [id, username, password, type]);
                    if (result == null) {
                        console.error('Failed to add user');
                    } else {
                        if (result.rows && result.rows.length > 0) {
                            console.log(`User added successfully: ID = ${id}`);
                        } else {
                            console.error('Failed to add user');
                        }
                    }
                    break;
                default:
                    console.log('Unknown partition:', partition);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    public async spaceMessage(messageContent: string | undefined, partition: number) {
        if (messageContent) {
            const data = JSON.parse(messageContent);

            switch (partition) {
                case 1:  // addSpace
                    break;
                case 2:  // deleteSpace
                    break;
                default:
                    console.log('Unknown partition:', partition);
                    break;
            }
        } else {
            console.error('No message content provided');
        }
    }
    public async elementMessage(messageContent: string | undefined, partition: number) {
        if (messageContent) {
            const data = JSON.parse(messageContent);

            switch (partition) {
                case 1:  // addElementAdmin
                    console.log('Adding element for admin:', data);
                    break;
                case 2:  // updateElementAdmin
                    console.log('Updating element for admin:', data);
                    break;
                case 3:  // addAvatar
                    console.log('Adding avatar:', data);
                    break;
                case 4:  // addMap
                    console.log('Adding map:', data);
                    break;
                default:
                    console.log('Unknown partition:', partition);
                    break;
            }
        } else {
            console.error('No message content provided');
        }
    }

}

// Usage
const queryManager = QueryManager.getInstance();
queryManager.initializeConnection();

export { queryManager };
