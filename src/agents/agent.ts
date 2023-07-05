import { inject, injectable } from "inversify";
import { IMessage, Step } from "../types";

@injectable()
export class Agent {
    private messages: IMessage[];
    private steps: Step[];

    constructor(@inject("IMessage") messages: IMessage[], @inject("Step") steps: Step[]){
        this.messages = messages;
        this.steps = steps;
    }

    async execute(): Promise<void> {

    }
}