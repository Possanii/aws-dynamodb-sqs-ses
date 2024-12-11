import { ILogGateway } from "../interfaces/gateways/ILogGateway";

// @Injectable({ devModeOnly: true })
export class ConsoleLogGateway implements ILogGateway {
  async log(logMessage: Record<string, unknown>): Promise<void> {
    console.log(`Log Service:`);
    console.log(JSON.stringify(logMessage, null, 2));
  }
}
