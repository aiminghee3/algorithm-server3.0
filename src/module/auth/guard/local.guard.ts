import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalMemberGuard extends AuthGuard('member') {}

@Injectable()
export class LocalManagerGuard extends AuthGuard('manager') {}
