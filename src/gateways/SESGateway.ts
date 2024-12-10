import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from "../config/env";
import {
  IEmailGateway,
  ISendEmailParams,
} from "../interfaces/gateways/IEmailGateway";

export class SESGateway implements IEmailGateway {
  async sendEmail({
    from,
    to,
    subject,
    html,
  }: ISendEmailParams): Promise<void> {
    // Send an confirmation e-mail to the customer
    const sesClient = new SESClient({
      region: env.AWS_REGION,
    });

    const sendEmailCommand = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Charset: "utf-8",
          Data: subject,
        },
        Body: {
          Html: {
            Charset: "utf-8",
            Data: html,
          },
        },
      },
    });

    await sesClient.send(sendEmailCommand);
  }
}
