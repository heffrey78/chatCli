import { injectable } from "inversify";
import { IConversation, IMessage } from "../types";

@injectable()
export class ConversationDto implements IConversation {
    id!: number;
    name!: string;
    messages: IMessage[];

    constructor() {
        this.messages = [];
    }
}