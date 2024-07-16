import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import moment from "moment";
import { Member } from "../../member/entity/member.entity";

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {};

  async scheduleNotification(member: Member, title: string, dateString: Date) {

    const delay = moment(dateString).diff(moment());

    if(delay > 0){
      await this.notificationQueue.add('sendNotification',
        { token: member.fcmToken, title: title},
        { delay }
      )
    }
    else{
      throw new Error('알람 시간이 현재 시간보다 이전입니다.')
    }
  }
}