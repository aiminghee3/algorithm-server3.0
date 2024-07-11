import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Member } from "../src/module/member/entity/member.entity";
import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { typeORMConfig } from "../src/config/typeorm.config";
import { envValidationSchema } from "../src/config/env-validation.config";
import { MemberModule } from "../src/module/member/member.module";
import * as request from 'supertest';

describe('MemberController', () =>{
  let app : INestApplication;
  let memberRepository : Repository<Member>;


  beforeAll(async () =>{
    const moduleFixture : TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env',
          load : [],
          cache : true,
          validationSchema: envValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            await typeORMConfig(configService),
        }),
        MemberModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    memberRepository = moduleFixture.get<Repository<Member>>(getRepositoryToken(Member));
  })

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await memberRepository.query('DELETE FROM member;');
  });

  describe('회원가입', () =>{
    it('회원가입 성공', async () =>{
      //given
      const createMemberDto = {
        email : "test@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!"
      };

      //when, then
      return request(app.getHttpServer())
        .post('/member/signup')
        .send(createMemberDto)
        .expect(201)
        .then((response) => {
          expect(response.body.created).toBeDefined();
        });
    })

    it('실패 - 회원가입 시 비밀번호 확인 불일치', async () =>{
      //given
      const createMemberDto = {
        email : "test@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!@"
      }
      //when, then
      return request(app.getHttpServer())
        .post('/member/signup')
        .send(createMemberDto)
        .expect(400)
        .then((response) => {
        expect(response.body.message).toContain('패스워드 불일치');
      });
    })

    it('실패 - 회원가입 시 이미 존재하는 회원', async () =>{
      //given
      const member1 = {
        email : "test@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!",
      }
      const member2 = {
        email : "test@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!",
      }
      const saveMember = memberRepository.create(member1);
      await memberRepository.save(saveMember);
      //when, then
      return request(app.getHttpServer())
        .post('/member/signup')
        .send(member2)
        .expect(409)
        .then((response) =>{
          expect(response.body.message).toContain(member1.email);
        })
    })
  })

  describe('회원조회', () =>{
    it('성공 - 회원 전체조회', async () =>{
      //given
      const member1 = {
        email : "test1@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!",
      }
      const member2 = {
        email : "test2@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!",
      }
      await memberRepository.save(member1);
      await memberRepository.save(member2);

      //when, then
      return request(app.getHttpServer())
        .get('/member/all')
        .expect(200)
        .then((response) =>{
          expect(response.body.length).toEqual(2);
        })
    })

    it('성공 - 회원 조회', async () =>{
      //given
      const member = {
        id : 1,
        email : "test1@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!",
      }
      await memberRepository.save(member)
      //when, then
      return request(app.getHttpServer())
        .get('/member/1')
        .expect(200)
        .then((response)=>{
          expect(response.body.id).toEqual(1);
        })
    })

    it('실패 - 존재하지 않는 회원 조회', async () =>{
      //when, then
      return request(app.getHttpServer())
        .get('/member/1')
        .expect(404)
        .then((response) =>{
          expect(response.body.message).toContain('존재하지 않는 회원입니다.');
        })
    })
  })
  describe('회원삭제', () =>{
    it('성공 - 회원삭제', async () =>{
      //given
      const member = {
        id : 1,
        email : "test1@naver.com",
        password : "wpsxmfks3135!",
        passwordCheck : "wpsxmfks3135!",
      }
      const saveMember = memberRepository.create(member);
      await memberRepository.save(saveMember);

      //when, then
      return request(app.getHttpServer())
        .delete('/member/1')
        .expect(200)
        .then((response) =>{
          expect(response.body.id).toEqual(saveMember.id);
        })
    })

    it('실패 - 존재하지 않는 회원삭제', async () =>{
      // when, then

      return request(app.getHttpServer())
        .delete('/member/1')
        .expect(404)
        .then((response) =>{
          expect(response.body.message).toContain('존재하지 않는 회원입니다.');
        })
    })
  })
})