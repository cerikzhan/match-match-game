import { Database } from './db';

export class Model {
  database: Database;

  constructor() {
    this.database = new Database();
    this.database.init('user', 'iamserik');
  }
}
