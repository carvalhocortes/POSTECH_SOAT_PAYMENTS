import * as dynamoose from 'dynamoose';

class Database {
  private constructor() {}

  private static ddb() {
    return new dynamoose.aws.ddb.DynamoDB({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
      region: process.env.AWS_REGION!,
    });
  }

  public static getInstance() {
    const ddb = this.ddb();
    return dynamoose.aws.ddb.set(ddb);
  }

  public static async connect(): Promise<void> {
    try {
      const ddb = Database.ddb();
      await ddb.listTables();
      console.log('Connected to DynamoDB');
    } catch (error) {
      console.log('Failed to connect to DynamoDB:', error);
      process.exit(1);
    }
  }

  public static async disconnect(): Promise<void> {
    console.log('DynamoDB disconnected');
  }
}

export const database = Database;
