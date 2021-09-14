import { Database } from './db';

export interface RecordType {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  score: number;
}

export class RecordModel {
  dbName = 'iamserik';

  collection = 'records';

  database: Database;

  constructor() {
    this.database = new Database();
  }

  async initialize(): Promise<void> {
    await this.database.init(this.collection, this.dbName);
  }

  async getAll(): Promise<Array<RecordType>> {
    const arr: RecordType[] = await this.database.readAll<RecordType>(
      this.collection
    );
    return arr;
  }

  write(data: RecordType): boolean {
    let result = false;
    this.database
      .write<RecordType>(this.collection, data)
      .then((val) => {
        result = val;
      })
      .catch((err) => {
        throw new Error(`Something went wrong. Error: ${err}`);
      });
    return result;
  }
}
