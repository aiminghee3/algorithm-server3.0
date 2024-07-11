import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import * as firebaseConfig from './fcm.json';
import * as admin from 'firebase-admin';
import * as cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from "@nestjs/config";

const jobs = {};

@Injectable()
export class FcmService {
  constructor(
    private readonly configService: ConfigService,
  ) {
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

  async scheduleNotification(fcmToken : string, title : string, dateString : Date) {
    const date = new Date(dateString);
    const jobId: string = uuidv4();
    if (jobs[jobId]) {
      console.log(`Job with ID ${jobId} already exists. Skipping creation.`);
      return;
    }
    const cronTime = `0 0 9 ${date.getDate()} ${date.getMonth() + 1} *`;

    const job = cron.schedule(cronTime, () => {
      this.sendMessage(fcmToken, title);
      job.stop();
      delete jobs[jobId];
    });

    jobs[jobId] = job;
  }


  async sendMessage(token: string, title: string) {
    const payload = {
      token: token,
      notification: {
        title: title + '복습 알림입니다.',
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
    return result;
  }
}