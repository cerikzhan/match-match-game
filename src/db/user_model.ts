import { Model } from './model';

export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

export class UserModel extends Model {
  collection: string;

  constructor() {
    super();
    this.collection = 'users';
  }

  getAll(): Array<UserType> {
    const data: UserType[] = [];
    this.database
      .readAll<UserType>(this.collection)
      .then((value) => value.forEach((record) => data.push(record)));
    return data;
  }

  getUser(email: string): UserType {
    let user: UserType[] = [];
    this.database
      .filteredData(
        this.collection,
        (record: UserType) => record.email === email
      )
      .then((data) => {
        user = data;
      });
    return user[0];
  }

  write(data: UserType): boolean {
    let result = false;
    this.database
      .write(this.collection, data)
      .then((val) => {
        result = val;
      })
      .catch((err) => {
        throw new Error(`Something went wrong. Error: ${err}`);
      });
    return result;
  }
}
