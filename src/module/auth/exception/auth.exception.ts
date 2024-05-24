import { ExceptionWithMessage } from '../../../common/exception';

export class AlreadyExistedException extends ExceptionWithMessage {
  constructor(description?: string) {
    super(`Already Existed ${description}`, 409, 'already_existed');
  }
}
