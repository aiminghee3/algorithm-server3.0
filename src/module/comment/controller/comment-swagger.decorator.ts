import { applyDecorators, BadRequestException, NotFoundException } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { CreatedTimeResponse, DeletedTimeResponse, UpdatedTimeResponse } from "../../../common/dto/time-response.dto";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { InvalidTokenException, TokenExpiredException } from "../../auth/exception/auth.exception";

export const CreateCommentSwagger = () => {
  return applyDecorators(
  ApiOperation({
    summary: '댓글 작성',
    description: 'parentId는 nullable',
    deprecated: false,
  }),
    ApiOkResponse({
      type: CreatedTimeResponse,
    }),
    ApiException(() => [
      NotFoundException,
      TokenExpiredException,
      InvalidTokenException,
    ])
  );
}

export const UpdateCommentSwagger = () =>{
  return applyDecorators(
  ApiOperation({
    summary: '댓글 수정',
    description: '댓글 수정',
    deprecated: false,
  }),
    ApiOkResponse({
      type: UpdatedTimeResponse,
    }),
  ApiException(() =>[
    BadRequestException,
    NotFoundException,
    TokenExpiredException,
    InvalidTokenException,
  ])
  );
}

export const DeleteCommentSwagger = () =>{
  return applyDecorators(
  ApiOperation({
    summary: '댓글 삭제',
    description: '댓글 삭제',
    deprecated: false,
  }),
    ApiOkResponse({
      type: DeletedTimeResponse,
    }),
  ApiException(() =>[
    BadRequestException,
    NotFoundException,
    TokenExpiredException,
    InvalidTokenException,
  ])
);
}