import { injectable } from "inversify";
import { IMessage } from "../types";

@injectable()
export class MessageDto implements IMessage {
    id!: number;
    role!: string;
    content!: string;
    conversationId!: number;
}