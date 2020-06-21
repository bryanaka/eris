import {
  createConnection,
  Connection,
  ConnectionOptions,
  Repository,
  ObjectType,
  EntitySchema,
  EntityManager,
} from 'typeorm';
import { DEFAULT_DB_OPTIONS } from 'eris/config/db';

type RepositoryTarget<Entity> = ObjectType<Entity> | EntitySchema<Entity> | string;
type TransactionCallback<T> = (entityManager: EntityManager) => Promise<T>;

export default class DatabaseService {
  connection!: Connection;

  constructor(options: Partial<ConnectionOptions> = {}) {
    this.connect(options);
  }

  get isConnected(): boolean {
    return this.connection.isConnected;
  }

  get entityManager(): EntityManager {
    return this.connection.manager;
  }

  getRepository<Entity>(target: RepositoryTarget<Entity>): Repository<Entity> | Entity {
    return this.connection.getRepository<Entity>(target);
  }

  getCustomRepository<Repo>(customRepo: ObjectType<Repo>): Repo {
    return this.connection.getCustomRepository<Repo>(customRepo);
  }

  transaction<T>(transactionCallback: TransactionCallback<T>): Promise<T> {
    return this.connection.transaction<T>(transactionCallback);
  }

  async connect(options: Partial<ConnectionOptions>): Promise<void> {
    try {
      this.connection = await this.createConnection(options);
    } catch (err) {
      throw new Error(`Unable to connect to the database: ${err.message}`);
    }
  }

  async createConnection(options: Partial<ConnectionOptions> = {}): Promise<Connection> {
    const connectionOptions = Object.assign({}, DEFAULT_DB_OPTIONS, options) as ConnectionOptions;
    return await createConnection(connectionOptions);
  }
}
