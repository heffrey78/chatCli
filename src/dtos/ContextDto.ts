import { inject, injectable } from "inversify";
import { IContext, IConversation, TYPES } from "../types";

@injectable()
export class ContextDto implements IContext {
    conversation: IConversation;

    constructor(@inject(TYPES.IConversation) conversation: IConversation){
        this.conversation = conversation;
    }
}