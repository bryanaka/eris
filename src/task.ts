import { Client } from 'discord';

export default abstract class DiscordTask {
  client!: Client;

  async execute(): Promise<void> {
    throw new Error('you must define execute on the task class');
  }
}
