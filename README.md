# Eris: Goddess of Discord Bot Framework

:warning: This framework is in active development and in use by two different active bots to "dog food" the framework. I would not recommend using this framework quite yet.

Eris Bot Framework is a convention over configuration framwork to standardize discord bot creation. Inpiration is take from Rails and Ember, where we believe that the energy and inovation should be spent building a unique product, not in tweaking configuation and code architecture.

## Concepts

There are a few core concepts to get familar with when working with the Eris Bot Framework

- **Eris**: The core bot class that wraps the discord.js client
- **Commands**: Discord Commands with CLI level support
- **Routers**: Coordinates Event handling from the client
- **Services**: Services outside the discord ecosystem that level up the bot's capabilities

Below we dive depper into each of these comcepts.

### Eris Bot

The heart and soul of your bot. This will be your entry point into running an Eris bot.

There are two important functions to know for the Eris Bot.

**Eris#use**

`use` accepts one parameter: an object that will be delegated to to handle certain events in the system.

The most common example is the an instance of the `CommandRouter`, which will listen for messages that are issuing commands and then execute the commands.

The example below imports a command router you've created and tells eris to use it to handle commands.

```ts
import { commandsRouter } from 'app/router';

const eris = new Eris();
eris.use(commandsRouter);
```

**Eris#run**

Once your bot is ready to run, you will call `run`. This method requires a discord token and will login as the bot.

```ts
import { commandsRouter } from 'app/router';

const eris = new Eris();
eris.use(commandsRouter);

// call run
eris.run(`${process.env.DISCORD_BOT_TOKEN}`);
```

#### All Together Now

Given the examples above, here is a full example of what it might look like to instrument a "main" function that will run your bot.

```ts
// app/run.ts
import Eris from 'eris';
import dotenv from 'dotenv';
import { commandsRouter } from 'app/router';

// use dotenv to store sensitive info!
dotenv.config();

export default function main(): Promise<string> {
  const eris = new Eris();
  eris.use(commandsRouter);
  return eris.run(`${process.env.DISCORD_BOT_TOKEN}`);
}
```

### Commands

By subclassing `ErisCommand`, you can create a complex command interface.

```ts
// app/commands/party.ts
import ErisCommand from 'eris/command';

export default class PartyCommand extends ErisCommand {
  async execute(): Promise<void> {
    // do what every you want here
  }
}
```

### Routers

Routers are used to listen to events from discord like a new message or a reaction, then route applicable events to a delegated handler.

With the example of commands, the command router listens to messages incoming on the server and looks for a matching command. If it finds one, it will route to that command "Executor".

#### Command Router

The command router is used to register commands for the bot to respond to. It can register a command using a `Command` subclass
or using a simple async function.

```ts
// app/router.ts
import { Message } from 'discord';
import { CommandRouter } from 'eris/routers';
import PartyCommand from './commands/party';

const commandRouter = new CommandRouter({ prefix: '-' });

// Class based Command Executor
commandRouter.register('party', PartyCommand);

// Function based Command Executor
commandRouter.register('sup', async function sup(message: Message) {
 // do stuff here
});

export { commandRouter };
```

#### More Routers Coming Soon!

### Services

Services are singleton class instances that are meant to interact with things outside discord
ecosystem. This can range from the provided Database service to a service that consumes an entirely
external API.

Here is a simple example of a service that wraps usage of the a currency converter API.

```ts
import fetch from 'fetch';

export class CurrencyConverterAPIService {
  accessKey: string = process.env.API_KEY;

  async getConversions(amount:number, from: string, to: string) {
    const qs = this.serializeQueryString({ from, to, amount });
    const result = await fetch(`https://data.fixer.io/api/convert?${qs}`);
    return await result.json();
  }

  serializeQueryString(params = {}) {
    params.access_key = this.accessKey;
    return qs.stringify(params);
  }
}
```

#### Database Service

A provided service that assists in connecting to a database.

We make use of TypeORM to power data querying and database migration.

NOTE: decorators are not yet implemented

```ts
// app/commands/cool-db.ts
import ErisCommand from 'eris/command';
import User from 'eris/entities';
import { service, commandArg as arg } from 'eris/decorators';

export default class CoolDBCommand extends ErisCommand {
  @service db: DatabaseService;

  // looks magical because idk what syntax will be yet
  @arg userId

  async execute(): Promise<void> {
    const userRepo = this.db.getRepo(User);
    const user = await userRepo.findOne({ id: this.userId });
    this.message.reply(`YOU SO COOL USER ID ${user.name}`)
  }
}
```