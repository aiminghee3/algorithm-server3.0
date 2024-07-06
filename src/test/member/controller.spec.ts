import { MemberService } from "../../module/member/service/member.service";
import { MemberController } from "../../module/member/controller/member.controller";
import { Test } from "@nestjs/testing";
import { CreateMemberDto } from "../../module/member/dto/create-member.dto";
import { CreatedTimeResponse } from "../../common/dto/time-response.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AlreadyExistedException } from "../../common/exception";
import { Member } from "../../module/member/entity/member.entity";

describe('MemberController', () => {

  let memberService: MemberService;
  let memberController: MemberController;

  const mockMemberService = {
    signUp: jest.fn(),
    getAllMember : jest.fn(),
    getMember : jest.fn(),
    removeMember : jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: mockMemberService, // 가상 서비스
        }
      ],
    }).compile();

    memberService = moduleRef.get<MemberService>(MemberService);
    memberController = moduleRef.get<MemberController>(MemberController);
  });

  it('to be defined', async () => {
    expect(memberController).toBeDefined();
    expect(memberService).toBeDefined();
  });

  describe('회원가입', () =>{
    it('회원가입 성공', async () => {
      // given
      const createMemberDto: CreateMemberDto = {
        email: 'test@naver.com',
        password: 'test1234',
        passwordCheck: 'test1234',
      };
      const mockDate = new Date();
      const mockResponse = { created: mockDate } as CreatedTimeResponse;
      jest.spyOn(memberService, 'signUp').mockResolvedValue(mockResponse);

      // when
      const result = await memberController.signUp(createMemberDto);

      // then
      expect(memberService.signUp).toHaveBeenCalled();
      expect(result.created).toEqual(mockDate);
    });

    it('회원가입 실패 - 비밀번호 불일치', async () =>{
      //given
      const createMemberDto : CreateMemberDto = {
        email : 'test@naver.com',
        password : 'test1234',
        passwordCheck : 'test1235'
      }

      //given
      jest.spyOn(mockMemberService, 'signUp').mockImplementation(async (createMemberDto ) => {
        if(createMemberDto.password !== createMemberDto.passwordCheck){
          throw new BadRequestException('패스워드 불일치');
        }
        return { created : new Date() };
      });

      //when, then
      await expect(memberController.signUp(createMemberDto)).rejects.toThrowError(new BadRequestException('패스워드 불일치'));
    })

    it('회원가입 실패 - 이미 존재하는 회원', async () =>{
      //given
      const existingMember = {email : 'test@naver.com'}
      const createMemberDto : CreateMemberDto = {
        email : 'test@naver.com',
        password : 'test1234',
        passwordCheck : 'test1234'
      }
      //when
      jest.spyOn(mockMemberService, 'signUp').mockImplementation(async (createMemberDto) => {
        if(existingMember.email === createMemberDto.email){
          throw new AlreadyExistedException(existingMember.email);
        }
        return { created : new Date() };
      });

      //then
      await expect(memberController.signUp(createMemberDto)).rejects.toThrow(AlreadyExistedException);
    })
  })


  describe('회원조회', () => {
    it('성공 - 전체 회원조회', async () => {
      //given
      const mockMember1= {
        id: 1,
        email: 'test1@naver.com',
        password: 'test1234',
      };
      const mockMember2= {
        id: 2,
        email: 'test2@naver.com',
        password: 'test1234',
      };

      mockMemberService.getAllMember.mockReturnValue([mockMember1, mockMember2]);

      // when
      const result : Member[] = await memberController.getAllMember();

      // then
      expect(result.length).toEqual(2);
    });

    it('성공 - 회원조회', async () => {
      //given
      const mockMember1= {
        id: 1,
        email: 'test1@naver.com',
        password: 'test1234',
      };
      mockMemberService.getMember.mockResolvedValue(mockMember1);
      //when
      const result = await memberController.getMember(1);

      //then
      expect(result).toEqual(mockMember1);
    })
    it('실패 - 존재하지 않는 회원 조회', async () =>{
      //given
      mockMemberService.getMember.mockImplementation(() => {
        throw new NotFoundException('존재하지 않는 회원입니다.');
      });

      //when, then
      await expect(memberController.getMember(1)).rejects.toThrowError(NotFoundException);
    })
  });
  describe('회원삭제', ()=>{
    it('성공 - 회원삭제', async () =>{
      //given
      const member = {
        id : 1,
        email : "testEmail@naver.com",
        password : 'password',
      }
      mockMemberService.removeMember.mockResolvedValueOnce(member);

      //when
      const result = await memberController.removeMember(member.id);

      //then
      expect(result).toEqual(member);
    })

    it('실패 - 없는 회원 삭제', async () =>{
      //given
      mockMemberService.removeMember.mockImplementationOnce(() =>{
        throw new NotFoundException('회원이 존재하지 않습니다.');
      })

      //when, then
      await expect(memberController.removeMember(1)).rejects.toThrowError(NotFoundException);
    })
  })
});