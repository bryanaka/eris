import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class DiscordUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  discordUserId!: string;
}
