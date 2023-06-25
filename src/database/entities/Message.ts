import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Conversation } from "./Conversation";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  role: string = "";

  @Column()
  content: string = "";

  @ManyToOne(() => Conversation, (conversation: Conversation) => conversation.messages)
  conversation: Conversation | undefined;
}
