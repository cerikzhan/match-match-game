export class Database {
  db: IDBDatabase | null = null;

  init(collection: string, dbName: string, version?: number): Promise<void> {
    return new Promise((resolve) => {
      const openRequest = indexedDB.open(dbName, version);
      openRequest.onupgradeneeded = () => {
        const database = openRequest.result;
        const recordStore = database.createObjectStore(collection, {
          keyPath: 'id',
          autoIncrement: true,
        });
        recordStore.createIndex('email', 'email', { unique: false });
        this.db = database;
        resolve();
      };
      openRequest.onsuccess = () => {
        this.db = openRequest.result;
        resolve();
      };
    });
  }

  write<T>(collection: string, data: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) return;
      const tx = this.db.transaction(collection, 'readwrite');
      const store = tx.objectStore(collection);
      const res = store.add(data);

      tx.oncomplete = () => {
        resolve(true);
      };

      tx.onerror = () => {
        reject(res.error);
      };
    });
  }

  readAll<T>(collection: string): Promise<Array<T>> {
    return new Promise((resolve) => {
      if (!this.db) return;
      const tx = this.db.transaction(collection, 'readonly');
      const store = tx.objectStore(collection);
      const result = store.getAll();

      tx.oncomplete = () => {
        const res: T[] = result.result;
        resolve(res);
      };
    });
  }

  filteredData<T>(
    collection: string,
    filter: (item: T) => boolean
  ): Promise<Array<T>> {
    return new Promise((resolve) => {
      if (!this.db) return;
      const tx = this.db.transaction(collection, 'readonly');
      const store = tx.objectStore(collection);
      const result = store.index('email').openCursor(null, 'prev');
      const resData: T[] = [];
      result.onsuccess = () => {
        const cursor = result.result;
        if (cursor) {
          const currenValue: T = cursor.value;
          if (filter(currenValue)) {
            resData.push(currenValue);
          }
          cursor.continue();
        }
      };
      tx.oncomplete = () => {
        resolve(resData);
      };
    });
  }
}
