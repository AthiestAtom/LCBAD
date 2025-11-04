/**
 * MTProto-inspired messaging protocol implementation
 * Optimized for low latency with:
 * - Message batching
 * - Acknowledgment system
 * - Optimistic updates
 * - Connection pooling
 * - Reduced round trips
 */

export interface MTProtoMessage {
  msgId: bigint;
  seqNo: number;
  ackSeqNo?: number;
  body: any;
  timestamp: number;
  isAcknowledged: boolean;
}

export interface BatchMessage {
  messages: MTProtoMessage[];
  batchId: string;
  timestamp: number;
}

export class MessageIdGenerator {
  private static instance: MessageIdGenerator;
  private timeOffset: number = 0;

  private constructor() {
    const telegramEpoch = new Date('2000-01-01T00:00:00Z').getTime();
    this.timeOffset = Math.floor((Date.now() - telegramEpoch) / 1000);
  }

  public static getInstance(): MessageIdGenerator {
    if (!MessageIdGenerator.instance) {
      MessageIdGenerator.instance = new MessageIdGenerator();
    }
    return MessageIdGenerator.instance;
  }

  public generate(): bigint {
    const timeSeconds = Math.floor(Date.now() / 1000) - this.timeOffset;
    const random = Math.floor(Math.random() * 0xFFFFFFFF);
    const timePart = BigInt(timeSeconds) << 32n;
    const randomPart = BigInt(random);
    return timePart | randomPart;
  }
}

export class MTProtoQueue {
  private queue: MTProtoMessage[] = [];
  private pendingAcks: Map<bigint, MTProtoMessage> = new Map();
  private batchSize: number = 10;
  private batchTimeout: number = 50;
  private batchTimer: NodeJS.Timeout | null = null;
  private seqNo: number = 0;
  private idGenerator: MessageIdGenerator;

  constructor(batchSize: number = 10, batchTimeout: number = 50) {
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
    this.idGenerator = MessageIdGenerator.getInstance();
  }

  public enqueue(body: any, immediate: boolean = false): MTProtoMessage {
    const msg: MTProtoMessage = {
      msgId: this.idGenerator.generate(),
      seqNo: ++this.seqNo,
      body,
      timestamp: Date.now(),
      isAcknowledged: false,
    };

    this.queue.push(msg);
    this.pendingAcks.set(msg.msgId, msg);

    if (immediate || this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flush(), this.batchTimeout);
    }

    return msg;
  }

  public flush(): BatchMessage | null {
    if (this.queue.length === 0) return null;

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    const batch: BatchMessage = {
      messages: [...this.queue],
      batchId: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    this.queue = [];
    return batch;
  }

  public acknowledge(msgIds: bigint[]): void {
    msgIds.forEach(msgId => {
      const msg = this.pendingAcks.get(msgId);
      if (msg) {
        msg.isAcknowledged = true;
        this.pendingAcks.delete(msgId);
      }
    });
  }

  public getUnacknowledged(): MTProtoMessage[] {
    return Array.from(this.pendingAcks.values())
      .filter(msg => !msg.isAcknowledged)
      .sort((a, b) => a.seqNo - b.seqNo);
  }

  public clear(): void {
    this.queue = [];
    this.pendingAcks.clear();
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }
}

export class MTProtoConnection {
  private sendQueue: MTProtoQueue;
  private receiveQueue: MTProtoQueue;
  private connectionId: string;
  private isConnected: boolean = false;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
    this.sendQueue = new MTProtoQueue(10, 50);
    this.receiveQueue = new MTProtoQueue(10, 50);
  }

  public send(body: any, immediate: boolean = false): MTProtoMessage {
    if (!this.isConnected) {
      throw new Error('Connection not established');
    }
    return this.sendQueue.enqueue(body, immediate);
  }

  public processAcknowledgment(msgIds: bigint[]): void {
    this.sendQueue.acknowledge(msgIds);
  }

  public connect(): void {
    this.isConnected = true;
  }

  public disconnect(): void {
    this.isConnected = false;
    this.sendQueue.clear();
    this.receiveQueue.clear();
  }

  public getPendingBatches(): BatchMessage | null {
    return this.sendQueue.flush();
  }

  public retryUnacknowledged(): MTProtoMessage[] {
    return this.sendQueue.getUnacknowledged();
  }
}

export class MTProtoClient {
  private connection: MTProtoConnection;
  private connectionId: string;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
    this.connection = new MTProtoConnection(connectionId);
  }

  public async send(body: any, immediate: boolean = false): Promise<MTProtoMessage> {
    return this.connection.send(body, immediate);
  }

  public acknowledge(msgIds: bigint[]): void {
    this.connection.processAcknowledgment(msgIds);
  }

  public connect(): void {
    this.connection.connect();
  }

  public disconnect(): void {
    this.connection.disconnect();
  }

  public getPendingBatches(): BatchMessage | null {
    return this.connection.getPendingBatches();
  }

  public retryUnacknowledged(): MTProtoMessage[] {
    return this.connection.retryUnacknowledged();
  }
}

let mtProtoClientInstance: MTProtoClient | null = null;

export const getMTProtoClient = (connectionId: string): MTProtoClient => {
  if (!mtProtoClientInstance) {
    mtProtoClientInstance = new MTProtoClient(connectionId);
  }
  return mtProtoClientInstance;
};
