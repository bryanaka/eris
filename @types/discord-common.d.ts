import { Message, Snowflake, User, GuildEmoji } from 'discord';
import { Collection } from '@discordjs/collection';

declare module 'discord' {
  export type MessageCollection = Collection<Snowflake, Message>;

  export type UserCollection = Collection<Snowflake, User>;

  export type EmojiCollection = Collection<Snowflake, GuildEmoji>;
}
