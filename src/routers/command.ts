import Eris from 'eris';
import { Client, Message } from 'discord';
import Command from 'eris/command';
import { EventRouter, EEventRouterType } from 'eris/routers';
import { DefaultCommandOptions } from 'eris/command/command';
import parseCommand, { CommandStruct } from 'eris/utils/parse-command';

interface CommandRouterOptions {
  prefix?: string;
}

type CommandExecutorClass<T extends Command> = {
  new (message: Message, options: DefaultCommandOptions): T;
};

type CommandExecutorFunction = (message: Message) => Promise<void>;
type CommandExecutor<T extends Command = Command> =
  | CommandExecutorClass<T>
  | CommandExecutorFunction;

interface CommandRouteStruct {
  executor: CommandExecutor;
  options: Record<string, unknown>;
}

export default class CommandRouter implements EventRouter {
  routerType = EEventRouterType.Command;

  eventType = 'message';

  client!: Client;

  options: CommandRouterOptions;

  protected registry = new Map<string, CommandRouteStruct>();

  get prefix(): string {
    return this.options.prefix || '-';
  }

  _dispatch: (message: Message) => Promise<string | false>;

  constructor(options: CommandRouterOptions = {}) {
    this.options = options;
    this._dispatch = this.dispatch.bind(this);
  }

  register<T extends Command>(
    matcher: string,
    executor: CommandExecutor<T>,
    options: Record<string, unknown> = {},
  ): void {
    const normalizedMatcher = this.normalizeMatcher(matcher);
    const routingStruct = { executor, options } as CommandRouteStruct;
    this.registry.set(normalizedMatcher, routingStruct);
  }

  mount(app: Eris): void {
    this.client = app.client;
    this.client.on('message', this._dispatch);
  }

  unmount(): void {
    this.client.off('message', this._dispatch);
  }

  async dispatch(message: Message): Promise<string | false> {
    // check if starts with prefix
    const key = this.extractRegistryKey(message);
    const [matcher, routingStruct] = this.findRegistryMatch(key) || [];

    if (matcher && routingStruct) {
      if (this.shouldDispatch(routingStruct, message)) {
        await this._execute(routingStruct, message);
      }
      return matcher;
    } else {
      return false;
    }
  }

  isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }

  parseCommand(message: Message): CommandStruct {
    return parseCommand(this.prefix, message);
  }

  protected normalizeMatcher(matcher: string): string {
    return `${matcher.toLowerCase()}`;
  }

  protected extractRegistryKey(message: Message): string {
    const { name } = this.parseCommand(message);
    return name;
  }

  protected findRegistryMatch(key: string): [string, CommandRouteStruct] | void {
    const routingStruct = this.registry.get(key);
    return routingStruct ? [key, routingStruct] : undefined;
  }

  protected shouldDispatch(routingStruct: CommandRouteStruct, message: Message): boolean;
  protected shouldDispatch(): boolean {
    return true;
  }

  protected buildExecutorOptions(options: Record<string, unknown>): DefaultCommandOptions {
    return Object.assign({}, options, { prefix: this.prefix });
  }

  protected async _execute(routingStruct: CommandRouteStruct, message: Message): Promise<void> {
    const { executor, options } = routingStruct;
    const exeOpt = this.buildExecutorOptions(options);

    try {
      if (this.isClassExecutor(executor)) {
        const executorInstance = new executor(message, exeOpt);
        executorInstance.client = this.client;
        await executorInstance.execute();
      } else if (this.isFunctionExecutor(executor)) {
        await executor(message);
      }
    } catch (err) {
      console.error(`
Error while trying to execute action.
Error Message: ${err.message}`);
    }
  }

  protected isFunctionExecutor(executor: CommandExecutor): executor is CommandExecutorFunction {
    const isFunctionBased =
      executor && typeof executor === 'function' && !executor.prototype.execute;
    return !!isFunctionBased;
  }

  protected isClassExecutor(executor: CommandExecutor): executor is typeof Command {
    return !!(executor && executor.prototype?.execute);
  }
}
