import 'reflect-metadata';
import Discord, { ClientOptions, ClientUser } from 'discord';
import { EventRouter, EEventRouterType } from 'eris/routers';

type RouterSet = Set<EventRouter>;

type RouterRegistry = Map<EEventRouterType, RouterSet>;

export default class Eris {
  client!: Discord.Client;

  #routerRegistry: RouterRegistry = new Map();

  constructor(options?: ClientOptions) {
    this.client = new Discord.Client(options);
  }

  get botUser(): ClientUser | null {
    return this.client.user;
  }

  use(router: EventRouter): void {
    const routerType = router.routerType;
    const routers = this.#routerRegistry.get(routerType) || new Set();

    if (routers.has(router)) {
      throw new Error(`You've included the same ${routerType} router twice`);
    }

    routers.add(router);
    this.#routerRegistry.set(routerType, routers);

    router.mount(this);
  }

  remove(router: EventRouter): EventRouter {
    const routerType = router.routerType;
    const routers = this.#routerRegistry.get(routerType);

    if (routers && routers.has(router)) {
      routers.delete(router);
    }

    router.unmount(this);

    return router;
  }

  run(token: string): Promise<string> {
    this.client.on('ready', (...args) => this.onReady(...args));
    this.client.on('debug', (...args) => this.onDebug(...args));
    this.client.on('warn', (...args) => this.onWarn(...args));
    this.client.on('error', (...args) => this.onError(...args));

    return this.client.login(token);
  }

  onReady(): void {
    console.log(`Logged in as ${this.botUser?.tag}!`);
  }

  onDebug(info: string): void {
    console.debug(`[DEBUG]: ${info}`);
  }

  onError(err: Error): void {
    console.error(`[ERROR]: ${err.message}`);
  }

  onWarn(info: string): void {
    console.warn(`[WARNING]: ${info}`);
  }
}
