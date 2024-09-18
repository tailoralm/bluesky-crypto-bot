import { AttributeDefinition, CreateTableCommand, CreateTableCommandInput, DescribeTableCommand, DynamoDBClient, KeySchemaElement } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, DeleteCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { chunkArray } from "../../../shared/utils/format.utils";

export abstract class DynamodbStorage {
    private client: DynamoDBDocumentClient;
    private tableName: string;
    
    constructor(tableName: string) {
        this.tableName = tableName;

        const dynamoClient = new DynamoDBClient({ endpoint: process.env.DYNAMODB_ENDPOINT });

        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }

    async saveItem(item: any): Promise<void> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: item
        });
        await this.client.send(command);
    }
    
    async saveItems(items: any[]): Promise<void> {
        const batches = chunkArray(items, 25);
    
        for (const batch of batches) {
            const batchItems = batch.map(item => ({
                PutRequest: {
                    Item: item
                }
            }));
    
            const command = new BatchWriteCommand({
                RequestItems: {
                    [this.tableName]: batchItems
                }
            });
    
            await this.client.send(command);
        }
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

    private async tableExists(): Promise<boolean> {
        try {
            const describeTableCommand = new DescribeTableCommand({
                TableName: this.tableName
            });
            await this.client.send(describeTableCommand);
            return true;
        } catch (error) {
            if (error.name === 'ResourceNotFoundException') {
                return false;
            }
            throw error;
        }
    }

    private async createTableIfNotExists(params: CreateTableCommandInput): Promise<void> {
        const exists = await this.tableExists();
        if (!exists) {
            console.log(`Table "${this.tableName}" does not exist. Creating...`);
            const command = new CreateTableCommand(params);
            await this.client.send(command);
            console.log(`Table "${this.tableName}" created.`);
        } else {
            console.log(`Table "${this.tableName}" already exists.`);
        }
    }

    protected async ensureTableExists(partitionKey: tableColumn, sortKey?: tableColumn): Promise<void> {
        const keySchema: KeySchemaElement[] = [{ AttributeName: partitionKey.AttributeName, KeyType: 'HASH' }];
        const attributeDefinition: AttributeDefinition[] = [{ AttributeName: partitionKey.AttributeName, AttributeType: partitionKey.AttributeType }];
        
        if (sortKey) {
            keySchema.push({ AttributeName: sortKey.AttributeName, KeyType: 'RANGE' });
            attributeDefinition.push({ AttributeName: sortKey.AttributeName, AttributeType: sortKey.AttributeType });
        }

        const tableParams: CreateTableCommandInput = {
            TableName: this.tableName,
            KeySchema: keySchema,
            AttributeDefinitions: attributeDefinition,
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        };

        await this.createTableIfNotExists(tableParams);
    }

}

type tableColumn = {
    AttributeName: string;
    AttributeType: 'S' | 'N' | 'B';
}
