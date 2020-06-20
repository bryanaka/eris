import { Message } from 'discord';

const ARG_SPLIT_REGEX = / +/;

export interface CommandStruct {
  name: string;
  args: string[];
}

export default function parseCommand(prefix: string, message: Message): CommandStruct {
  const commandTokens = message.content.slice(prefix.length).split(ARG_SPLIT_REGEX);
  const [commandName, ...commandArgs] = commandTokens;
  return { name: commandName, args: commandArgs };
}
