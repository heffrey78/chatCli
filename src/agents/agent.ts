import { inject, injectable } from "inversify";
import { Step } from "../types";
import { Conversation } from "../db";

@injectable()
export class Agent {
    // private conversation: Conversation;
    // private steps: Step[];

    // constructor(@inject("IMessage") conversation: Conversation, @inject("Step") steps: Step[]){
    //     this.conversation = conversation;
    //     this.steps = steps;
    // }

    async execute(): Promise<void> {

    }
}