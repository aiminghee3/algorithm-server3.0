import { applyDecorators, BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { CreatedTimeResponse } from "../../../common/dto/time-response.dto";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { AlreadyExistedException } from "../../../common/exception";
import { GetPostDetailDto } from "../dto/get-post-detail.dto";
import { GetAllPostDto } from "../dto/get-all-post.dto";
import { InvalidTokenException, TokenExpiredException } from "../../auth/exception/auth.exception";

export const createPostSwagger = () =>{
  return applyDecorators(
    ApiOperation({
      summary: '게시글 작성',
      description: '게시글 작성',
      deprecated: false,
    }),
    ApiOkResponse({
      type: CreatedTimeResponse,
    }),
    ApiException(() => [
      BadRequestException,
      TokenExpiredException,
      InvalidTokenException,
    ]),
  );
}

export const getPostSwagger = () =>{
  return applyDecorators(
    ApiOperation({
      summary: '게시글 조회',
      description: '게시글 조회',
      deprecated: false,
    }),
    ApiOkResponse({
      type: GetPostDetailDto,
    }),
    ApiException(() => [
      NotFoundException,
    ])
  );
}

export const getAllPostSwagger = () =>{
  return applyDecorators(
    ApiOperation({
      summary: '게시글 전체 조회',
      description: '게시글 전체 조회',
      deprecated: false,
    }),
    ApiOkResponse({
      type: GetAllPostDto,
    }),
  );
}

export const updatePostSwagger = () =>{
  return applyDecorators(
    ApiOperation({
      summary: '게시글 수정',
      description: '게시글 수정',
      deprecated: false,
    }),
    ApiOkResponse({
      type: CreatedTimeResponse,
    }),
    ApiException(() => [
      BadRequestException,
      NotFoundException,
      TokenExpiredException,
      InvalidTokenException,
      InternalServerErrorException
    ]),
  );
}

export const deletePostSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: '게시글 삭제',
      description: '게시글 삭제',
      deprecated: false,
    }),
    ApiOkResponse({
      type: CreatedTimeResponse,
    }),
    ApiException(() => [
      BadRequestException,
      NotFoundException,
      TokenExpiredException,
      InvalidTokenException,
      InternalServerErrorException
    ]),
  );
}