import {
  Message,
  Client,
  TextChannel,
  DMChannel,
  NewsChannel,
  EmojiCollection,
  GuildEmoji,
} from 'discord';
import parseCommand from 'eris/utils/parse-command';

export interface DefaultCommandOptions extends Record<string, unknown> {
  prefix: string;
}

export default class DiscordCommand<
  CommandOptions extends DefaultCommandOptions = DefaultCommandOptions
> {
  name!: string;

  message: Message;

  client!: Client;

  options: CommandOptions;

  args: unknown[];

  allowInTextChannel = true;

  allowInDMChannel = true;

  get prefix(): string {
    return this.options.prefix;
  }

  constructor(message: Message, options: CommandOptions) {
    this.options = options;
    const { args } = parseCommand(options.prefix, message);
    this.message = message;
    this.args = args;
  }

  get hasMentions(): boolean {
    return this.message.mentions.users.size > 0;
  }

  get channel(): TextChannel | DMChannel | NewsChannel {
    return this.message.channel;
  }

  get emojis(): EmojiCollection {
    return this.client.emojis.cache || this.client.emojis;
  }

  // Probably need embed factories
  // https://discord.js.org/#/docs/main/stable/class/MessageEmbed

  // DB connection with migrations

  // Something with reactions?
  //   const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID';
  // const collector = message.createReactionCollector(filter, { time: 15000 });
  // collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
  // collector.on('end', collected => console.log(`Collected ${collected.size} items`));

  getEmojiByName(name: string): GuildEmoji | void {
    return this.emojis.find(emoji => emoji.name === name);
  }

  async execute(): Promise<void> {
    throw new Error('you must define execute on the command class');
  }
}
