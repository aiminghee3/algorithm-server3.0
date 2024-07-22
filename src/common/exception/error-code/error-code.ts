class ErrorCodeVo{
  readonly status : number;
  readonly code : string;
  readonly message : string;

  constructor(status : number, code : string, message : string){
    this.status = status;
    this.code = code;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

// Common Error Codes
export const ENTITY_NOT_FOUND : ErrorCodeVo = new ErrorCodeVo(404, 'C001', 'Entity Not Found');
export const ALREADY_EXISTED : ErrorCodeVo= new ErrorCodeVo(409, 'C002', 'Already Existed');
export const INTERNAL_SERVER_ERROR : ErrorCodeVo = new ErrorCodeVo(500, 'C003', 'Internal Server Error');

// Auth Error Codes

// Notification Error Codes

// Member Error Codes

// Post Error Codes
export const POST_NOT_FOUND : ErrorCode = new ErrorCodeVo(404, 'P001', 'Post Not Found');