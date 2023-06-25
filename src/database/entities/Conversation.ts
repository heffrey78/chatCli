import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Message } from "./Message";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  name: string = "";

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[] | undefined;
}
