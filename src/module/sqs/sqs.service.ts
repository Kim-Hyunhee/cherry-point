import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdvertiserService } from '../advertiser/advertiser.service';

@Injectable()
export class SqsService implements OnModuleInit {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor(
    private configService: ConfigService,
    private advertiserService: AdvertiserService,
  ) {
    {
      this.sqsClient = new SQSClient({
        region: this.configService.get('AWS_S3_REGION'),
        credentials: {
          accessKeyId: this.configService.get('AWS_SQS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get('AWS_SQS_SECRET_ACCESS_KEY'),
        },
      });
      this.queueUrl =
        'https://sqs.ap-northeast-2.amazonaws.com/616095207692/advertiser_point_decrease_queue.fifo';
    }
  }

  async onModuleInit() {
    // this.pollMessages(); // 메시지를 지속적으로 수신하는 함수 호출
  }

  async sendAdvertiserPointDecreaseMessageToAwsSqs(
    advertiserId: number,
    decreasePoint: number,
  ) {
    const data = {
      advertiserId: advertiserId,
      decreasePoint: decreasePoint,
    };

    const groupId = 'reduce_point';

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(data),
      MessageGroupId: groupId,
      MessageDeduplicationId: groupId + new Date().getTime(),
    });

    try {
      const response = await this.sqsClient.send(command);
      return response;
    } catch (error) {
      throw error;
    }
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });

    try {
      await this.sqsClient.send(command);
    } catch (error) {
      throw error;
    }
  }
}
