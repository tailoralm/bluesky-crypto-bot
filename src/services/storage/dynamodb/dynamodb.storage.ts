// dynamoBase.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export abstract class DynamodbStorage {
    private client: DynamoDBDocumentClient;
    private tableName: string;
    
    constructor(tableName: string) {
        this.tableName = tableName;

        const dynamoClient = new DynamoDBClient({
            region: 'us-west-2', 
            endpoint: 'http://localhost:8000', 
        });

        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }

    async saveItem(item: any): Promise<void> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: item
        });
        await this.client.send(command);
    }

    async getItem(key: any): Promise<any> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: key
        });
        const result = await this.client.send(command);
        return result.Item;
    }

    async deleteItem(key: any): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: key
        });
        await this.client.send(command);
    }

    async scanTable(): Promise<any[]> {
        const command = new ScanCommand({
            TableName: this.tableName
        });
        const result = await this.client.send(command);
        return result.Items ?? [];
    }
}
