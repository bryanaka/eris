import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { DEFAULT_DB_OPTIONS } from 'eris/config/db';

export default class DatabaseService {
  connection!: Connection;

  constructor(options: Partial<ConnectionOptions> = {}) {
    this.connect(options);
  }

  get isConnected(): boolean {
    return !!this.connection;
  }

  getRepo(): void {
    return;
  }

  async connect(options: Partial<ConnectionOptions>): Promise<void> {
    try {
      this.connection = await this._createConnection(options);
    } catch (err) {
      throw new Error(`Unable to connect to the database: ${err.message}`);
    }
  }

  async _createConnection(options: Partial<ConnectionOptions> = {}): Promise<Connection> {
    const connectionOptions = Object.assign({}, DEFAULT_DB_OPTIONS, options) as ConnectionOptions;
    return await createConnection(connectionOptions);
  }
}
