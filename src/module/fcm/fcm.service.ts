import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import * as firebaseConfig from './fcm.json';
import * as admin from 'firebase-admin';
import * as cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';

const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url,
};
const jobs = {};

@Injectable()
export class FcmService {
  constructor() {
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