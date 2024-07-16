import { Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Job } from "bull";
import * as admin from "firebase-admin";
import { ConfigService } from "@nestjs/config";

@Injectable()
@Processor('notification')
export class NotificationProcessor{
  constructor(
    private readonly configService: ConfigService,
  ){
    const firebase_params = {
      type: this.configService.get<string>('FIREBASE_TYPE'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKeyId: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
      privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      clientId: this.configService.get<string>('FIREBASE_CLIENT_ID'),
      authUri: this.configService.get<string>('FIREBASE_AUTH_URI'),
      tokenUri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
      authProviderX509CertUrl: this.configService.get<string>('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
      clientC509CertUrl: this.configService.get<string>('FIREBASE_CLIENT_X509_CERT_URL'),
    };
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebase_params),
      });
    }
  }

  @Process('sendNotification')
  async handleSendNotification(job: Job){
    const { token, title } = job.data;

    const payload = {
      token: token,
      notification: {
        title: title + '문제 복습 알림입니다.',
        body: '오늘은' + title + '을(를) 복습하는 날입니다.',
      },
      data: {
        body: '오늘은' + title + '을(를) 복습하는 날입니다.',
      },
    };
    console.log(payload);
    const result = await admin
      .messaging()
      .send(payload)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
        // return true;
        return { sent_message: response };
      })
      .catch((error) => {
        // console.log('error');
        // console.log(error.code);
        // return false;
        return { error: error.code };
      });
    console.log('test');
    return result;
  }
}