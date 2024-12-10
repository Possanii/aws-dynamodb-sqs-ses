export interface IQueueGateway {
  publish(message: Record<string, unknown>): Promise<void>;
}
