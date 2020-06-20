import Eris from 'eris';
import CommandRouter from 'eris/routers/command';

export enum EEventRouterType {
  Command = 'command',
  Message = 'message',
}

export interface EventRouter {
  routerType: EEventRouterType;

  mount(app: Eris): void;

  unmount(): void;
  unmount(app: Eris): void;
}


export { CommandRouter };
