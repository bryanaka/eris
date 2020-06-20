import Service from 'eris/services';
import { createConnection } from 'typeorm';

export default class DatabaseService extends Service {
  async connect(): Promise<any> {
    try {
      const connection = await createConnection();
      return connection;
    } catch (err) {
      throw new Error('unable to connect to the database');
    }
  }

  getRepo(): void {
    return;
  }
}
